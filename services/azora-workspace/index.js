const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const nodemailer = require('nodemailer');
const imap = require('imap-simple');
const { simpleParser } = require('mailparser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'azora-workspace' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/azora-workspace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

// Models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  avatar: String,
  role: { type: String, default: 'user' },
  organization: String,
  emailSettings: {
    signature: String,
    autoReply: Boolean,
    autoReplyMessage: String,
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

const EmailSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: [{ type: String, required: true }],
  cc: [String],
  bcc: [String],
  subject: { type: String, required: true },
  body: { type: String, required: true },
  html: String,
  attachments: [{
    filename: String,
    contentType: String,
    size: Number,
    path: String,
  }],
  isRead: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  labels: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  threadId: String,
  sentAt: { type: Date, default: Date.now },
  receivedAt: Date,
});

const WorkspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  channels: [{
    name: String,
    type: { type: String, enum: ['text', 'voice'], default: 'text' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  }],
  settings: {
    isPublic: { type: Boolean, default: false },
    allowInvites: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const Email = mongoose.model('Email', EmailSchema);
const Workspace = mongoose.model('Workspace', WorkspaceSchema);

// Email transporter setup
const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'azora-workspace-secret');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'azora-workspace-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'azora-workspace-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email routes
app.get('/api/emails', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, folder = 'inbox' } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user._id };

    // Filter by folder/label
    if (folder === 'starred') {
      query.isStarred = true;
    } else if (folder === 'sent') {
      query.from = req.user.email;
    }

    const emails = await Email.find(query)
      .sort({ receivedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'email firstName lastName');

    const total = await Email.countDocuments(query);

    res.json({
      emails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Get emails error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/emails/send', authenticateToken, async (req, res) => {
  try {
    const { to, cc, bcc, subject, body, html, attachments } = req.body;

    // Create email record
    const email = new Email({
      from: req.user.email,
      to: Array.isArray(to) ? to : [to],
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : [],
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [],
      subject,
      body,
      html,
      userId: req.user._id,
      sentAt: new Date(),
    });

    await email.save();

    // Send email via SMTP
    const mailOptions = {
      from: req.user.email,
      to: email.to,
      cc: email.cc,
      bcc: email.bcc,
      subject: email.subject,
      text: email.body,
      html: email.html,
    };

    await emailTransporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Email sent successfully',
      email,
    });
  } catch (error) {
    logger.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.put('/api/emails/:id/read', authenticateToken, async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ email });
  } catch (error) {
    logger.error('Mark email read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Workspace routes
app.post('/api/workspaces', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    const workspace = new Workspace({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    await workspace.save();

    res.status(201).json({
      message: 'Workspace created successfully',
      workspace,
    });
  } catch (error) {
    logger.error('Create workspace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/workspaces', authenticateToken, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    }).populate('owner', 'email firstName lastName')
      .populate('members', 'email firstName lastName');

    res.json({ workspaces });
  } catch (error) {
    logger.error('Get workspaces error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload route
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Socket.IO for real-time collaboration
io.on('connection', (socket) => {
  logger.info('User connected:', socket.id);

  socket.on('join-workspace', (workspaceId) => {
    socket.join(workspaceId);
    logger.info(`User ${socket.id} joined workspace ${workspaceId}`);
  });

  socket.on('leave-workspace', (workspaceId) => {
    socket.leave(workspaceId);
    logger.info(`User ${socket.id} left workspace ${workspaceId}`);
  });

  socket.on('send-message', (data) => {
    const { workspaceId, channelId, message, userId } = data;
    io.to(workspaceId).emit('new-message', {
      channelId,
      message,
      userId,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    logger.info('User disconnected:', socket.id);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'azora-workspace',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 4100;
server.listen(PORT, () => {
  logger.info(`Azora Workspace service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });
});

module.exports = app;