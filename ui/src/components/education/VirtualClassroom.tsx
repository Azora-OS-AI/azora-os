import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  Users,
  Share,
  Hand,
  Settings,
  PhoneOff,
  Monitor,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Volume2,
  VolumeX
} from 'lucide-react';
import io, { Socket } from 'socket.io-client';

interface VirtualClassroomProps {
  userId: string;
  userRole?: string;
  classroomId?: string;
}

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  handRaised: boolean;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file';
}

export const VirtualClassroom: React.FC<VirtualClassroomProps> = ({
  userId,
  userRole = 'student',
  classroomId = 'default'
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  // Connect to Socket.IO
  useEffect(() => {
    const newSocket = io('http://localhost:4200', {
      query: { userId, classroomId, role: userRole }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to virtual classroom');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from virtual classroom');
    });

    newSocket.on('participants', (data: Participant[]) => {
      setParticipants(data);
    });

    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user-joined', (user: Participant) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        content: `${user.name} joined the classroom`,
        timestamp: new Date(),
        type: 'system'
      }]);
    });

    newSocket.on('user-left', (user: Participant) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        content: `${user.name} left the classroom`,
        timestamp: new Date(),
        type: 'system'
      }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId, classroomId, userRole]);

  // Fetch classroom data
  const { data: classroom, isLoading } = useQuery({
    queryKey: ['classroom', classroomId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/classroom/${classroomId}`);
      if (!response.ok) throw new Error('Failed to fetch classroom data');
      return response.json();
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!socket) throw new Error('Not connected to classroom');
      socket.emit('send-message', {
        content,
        type: 'text',
        timestamp: new Date()
      });
    },
    onSuccess: () => {
      setNewMessage('');
    },
  });

  // Toggle audio
  const toggleAudio = () => {
    setIsMuted(!isMuted);
    if (socket) {
      socket.emit('toggle-audio', { muted: !isMuted });
    }
  };

  // Toggle video
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (socket) {
      socket.emit('toggle-video', { videoOn: !isVideoOn });
    }
  };

  // Raise hand
  const toggleHand = () => {
    setHandRaised(!handRaised);
    if (socket) {
      socket.emit('raise-hand', { raised: !handRaised });
    }
  };

  // Start screen share
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      if (screenRef.current) {
        screenRef.current.srcObject = stream;
      }
      setIsScreenSharing(true);
      if (socket) {
        socket.emit('start-screen-share', { streamId: stream.id });
      }
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  // Stop screen share
  const stopScreenShare = () => {
    if (screenRef.current && screenRef.current.srcObject) {
      const stream = screenRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      screenRef.current.srcObject = null;
    }
    setIsScreenSharing(false);
    if (socket) {
      socket.emit('stop-screen-share');
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <h1 className="text-lg font-semibold">{classroom?.name || 'Virtual Classroom'}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-600">
            <Users className="h-3 w-3 mr-1" />
            {participants.length} participants
          </Badge>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Main Video/Screen Share */}
          <div className="h-full bg-gray-800 flex items-center justify-center">
            {isScreenSharing ? (
              <video
                ref={screenRef}
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No video or screen share active</p>
                <Button
                  onClick={startScreenShare}
                  className="mt-4"
                  variant="outline"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Screen
                </Button>
              </div>
            )}
          </div>

          {/* Participant Videos Grid */}
          <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-2 max-w-xs">
            {participants.slice(0, 4).map((participant) => (
              <div key={participant.id} className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden">
                {participant.isVideoOn ? (
                  <video className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 flex gap-1">
                  {participant.isMuted && <MicOff className="h-3 w-3 text-red-500" />}
                  {participant.handRaised && <Hand className="h-3 w-3 text-yellow-500" />}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-800 rounded-full px-6 py-3">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="sm"
              onClick={toggleAudio}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="sm"
              onClick={toggleVideo}
            >
              {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>

            <Button
              variant={handRaised ? "default" : "secondary"}
              size="sm"
              onClick={toggleHand}
            >
              <Hand className="h-4 w-4" />
            </Button>

            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="sm"
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
            >
              <Share className="h-4 w-4" />
            </Button>

            <Button variant="destructive" size="sm">
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col m-4 mt-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {message.userName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{message.userName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        message.type === 'system' ? 'text-blue-400 italic' : 'text-gray-200'
                      }`}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="participants" className="flex-1 m-4 mt-0">
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{participant.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {participant.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {participant.isMuted && <MicOff className="h-3 w-3 text-red-500" />}
                        {participant.handRaised && <Hand className="h-3 w-3 text-yellow-500" />}
                        {!participant.isOnline && <div className="w-2 h-2 bg-gray-500 rounded-full"></div>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};