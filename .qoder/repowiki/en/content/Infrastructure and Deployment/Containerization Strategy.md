# Containerization Strategy

<cite>
**Referenced Files in This Document**   
- [docker-compose.yml](file://vessels/docker-compose.yml)
- [docker-compose.prod.yml](file://vessels/docker-compose.prod.yml)
- [docker-compose.production.yml](file://vessels/docker-compose.production.yml)
- [docker-compose.monitoring.yml](file://vessels/docker-compose.monitoring.yml)
- [docker-compose.autonomous.yml](file://vessels/docker-compose.autonomous.yml)
- [docker-compose.compliance.yml](file://vessels/docker-compose.compliance.yml)
- [prometheus.yml](file://infrastructure/monitoring/prometheus.yml)
- [alertmanager.yml](file://infrastructure/monitoring/alertmanager.yml)
- [azora-mint/docker-compose.yml](file://services/azora-mint/docker-compose.yml)
- [ai-website-builder/docker-compose.yml](file://organs/ai-website-builder/docker-compose.yml)
- [Dockerfile](file://organs/ai-website-builder/docker/Dockerfile)
- [Dockerfile](file://services/azora-mint/docker/Dockerfile)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
Azora OS implements a comprehensive Docker-based containerization strategy to manage its complex microservices architecture. The system utilizes multi-service docker-compose configurations to support different operational modes including development, production, monitoring, autonomous operations, and compliance. This documentation details the implementation of containerization across various environments, explaining service definitions, network configurations, volume mounts, and environment variables. It also covers practical management of containerized services and addresses common containerization challenges.

## Project Structure
The containerization strategy is organized through multiple docker-compose files located primarily in the `vessels/` directory, with additional service-specific configurations in individual service directories. The main configuration files include:
- `docker-compose.yml`: Development environment configuration
- `docker-compose.prod.yml`: Production-ready configuration with health checks
- `docker-compose.production.yml`: Full production deployment with database services
- `docker-compose.monitoring.yml`: Monitoring stack with Prometheus, Grafana, and Alertmanager
- `docker-compose.autonomous.yml`: Autonomous operations services
- `docker-compose.compliance.yml`: Compliance and regulatory services

Each service may also have its own docker-compose configuration for isolated development and testing.

```mermaid
graph TD
A[Docker Compose Configurations] --> B[vessels/]
A --> C[Service-Specific]
B --> D[docker-compose.yml]
B --> E[docker-compose.prod.yml]
B --> F[docker-compose.production.yml]
B --> G[docker-compose.monitoring.yml]
B --> H[docker-compose.autonomous.yml]
B --> I[docker-compose.compliance.yml]
C --> J[azora-mint/]
C --> K[ai-website-builder/]
```

**Diagram sources**
- [docker-compose.yml](file://vessels/docker-compose.yml)
- [docker-compose.prod.yml](file://vessels/docker-compose.prod.yml)
- [docker-compose.production.yml](file://vessels/docker-compose.production.yml)
- [docker-compose.monitoring.yml](file://vessels/docker-compose.monitoring.yml)
- [docker-compose.autonomous.yml](file://vessels/docker-compose.autonomous.yml)
- [docker-compose.compliance.yml](file://vessels/docker-compose.compliance.yml)
- [azora-mint/docker-compose.yml](file://services/azora-mint/docker-compose.yml)
- [ai-website-builder/docker-compose.yml](file://organs/ai-website-builder/docker-compose.yml)

**Section sources**
- [vessels/](file://vessels/)
- [services/](file://services/)
- [organs/](file://organs/)

## Core Components
The containerization strategy centers around several core components that enable Azora OS to operate efficiently across different environments. These include the main application container, AI services, database services, monitoring infrastructure, and compliance services. Each component is containerized with specific configurations for resource allocation, networking, and health monitoring. The system leverages Docker's multi-stage builds for image optimization and implements health checks for service reliability.

**Section sources**
- [docker-compose.yml](file://vessels/docker-compose.yml)
- [docker-compose.prod.yml](file://vessels/docker-compose.prod.yml)
- [docker-compose.production.yml](file://vessels/docker-compose.production.yml)

## Architecture Overview
Azora OS employs a multi-layered containerization architecture that supports different operational modes through specialized docker-compose configurations. The architecture separates concerns by environment, with distinct configurations for development, production, monitoring, autonomous operations, and compliance. Services are organized into logical groups that can be deployed independently based on operational requirements.

```mermaid
graph TD
A[Containerization Architecture] --> B[Development Mode]
A --> C[Production Mode]
A --> D[Monitoring Mode]
A --> E[Autonomous Mode]
A --> F[Compliance Mode]
B --> G[docker-compose.yml]
C --> H[docker-compose.prod.yml]
C --> I[docker-compose.production.yml]
D --> J[docker-compose.monitoring.yml]
E --> K[docker-compose.autonomous.yml]
F --> L[docker-compose.compliance.yml]
G --> M[Main App]
G --> N[AI Services]
H --> O[Production Services]
H --> P[Health Checks]
I --> Q[Database Services]
I --> R[Redis]
J --> S[Prometheus]
J --> T[Grafana]
J --> U[Alertmanager]
K --> V[Tracing & Recovery]
K --> W[Snapshot Scheduler]
L --> X[Compliance Dashboard]
L --> Y[Regulatory Services]
```

**Diagram sources**
- [docker-compose.yml](file://vessels/docker-compose.yml)
- [docker-compose.prod.yml](file://vessels/docker-compose.prod.yml)
- [docker-compose.production.yml](file://vessels/docker-compose.production.yml)
- [docker-compose.monitoring.yml](file://vessels/docker-compose.monitoring.yml)
- [docker-compose.autonomous.yml](file://vessels/docker-compose.autonomous.yml)
- [docker-compose.compliance.yml](file://vessels/docker-compose.compliance.yml)

## Detailed Component Analysis

### Development Environment Configuration
The development environment configuration in `docker-compose.yml` defines the basic service structure for local development. It includes the main application and various AI services with development-specific settings.

```mermaid
graph TD
A[Development Services] --> B[Main App]
A --> C[AI Personalization]
A --> D[AI Sentiment]
A --> E[AI Chatbot]
A --> F[AI Vision]
B --> G[Port: 3000]
B --> H[NODE_ENV=development]
B --> I[REACT_APP_API_BASE=http://localhost]
B --> J[Depends on AI Services]
C --> K[Port: 3010]
D --> L[Port: 3011]
E --> M[Port: 3012]
F --> N[Port: 3013]
```

**Diagram sources**
- [docker-compose.yml](file://vessels/docker-compose.yml)

**Section sources**
- [docker-compose.yml](file://vessels/docker-compose.yml)

### Production Environment Configuration
The production environment configuration includes enhanced reliability features such as health checks and restart policies to ensure service availability.

```mermaid
graph TD
A[Production Services] --> B[Main App]
A --> C[AI Personalization]
B --> D[Port: 80:3000]
B --> E[NODE_ENV=production]
B --> F[REACT_APP_API_BASE=http://main-app]
B --> G[Restart: always]
B --> H[Health Check]
C --> I[Port: 3010]
C --> J[Restart: always]
C --> K[Health Check]
C --> L[curl -f http://localhost:3010/health]
```

**Diagram sources**
- [docker-compose.prod.yml](file://vessels/docker-compose.prod.yml)

**Section sources**
- [docker-compose.prod.yml](file://vessels/docker-compose.prod.yml)

### Monitoring Stack Configuration
The monitoring stack provides comprehensive observability for the containerized environment with Prometheus, Grafana, and supporting components.

```mermaid
classDiagram
class Prometheus {
+image : prom/prometheus : latest
+port : 9090
+volume : prometheus_data
+network : azora-monitoring
+restart : unless-stopped
}
class Grafana {
+image : grafana/grafana : latest
+port : 3001 : 3000
+volume : grafana_data
+environment : GF_SECURITY_ADMIN_PASSWORD
+dependsOn : Prometheus
+network : azora-monitoring
}
class NodeExporter {
+image : prom/node-exporter : latest
+port : 9100
+volume : /proc : /host/proc : ro
+network : azora-monitoring
}
class Alertmanager {
+image : prom/alertmanager : latest
+port : 9093
+volume : alertmanager_data
+network : azora-monitoring
}
Prometheus --> Grafana : "provides metrics"
NodeExporter --> Prometheus : "exposes system metrics"
Alertmanager --> Prometheus : "receives alerts"
```

**Diagram sources**
- [docker-compose.monitoring.yml](file://vessels/docker-compose.monitoring.yml)
- [prometheus.yml](file://infrastructure/monitoring/prometheus.yml)
- [alertmanager.yml](file://infrastructure/monitoring/alertmanager.yml)

**Section sources**
- [docker-compose.monitoring.yml](file://vessels/docker-compose.monitoring.yml)

### Autonomous Operations Configuration
The autonomous operations configuration supports self-healing and automated recovery capabilities.

```mermaid
sequenceDiagram
participant TracingRecovery
participant SnapshotScheduler
participant ZeroRating
participant FiveGManager
TracingRecovery->>SnapshotScheduler : Exposes tracing endpoint
SnapshotScheduler->>TracingRecovery : Polls for recovery events
ZeroRating->>Redis : Stores zero-rating data
FiveGManager->>Postgres : Stores 5G network data
FiveGManager->>Redis : Caches network state
loop Every 5 minutes
SnapshotScheduler->>TracingRecovery : Check for issues
alt Issue detected
SnapshotScheduler->>System : Trigger recovery
end
end
```

**Diagram sources**
- [docker-compose.autonomous.yml](file://vessels/docker-compose.autonomous.yml)

**Section sources**
- [docker-compose.autonomous.yml](file://vessels/docker-compose.autonomous.yml)

### Compliance Configuration
The compliance configuration manages regulatory requirements across multiple jurisdictions.

```mermaid
flowchart TD
A[Compliance Dashboard] --> B[GDPR Compliance]
A --> C[HIPAA Compliance]
A --> D[SOX Compliance]
A --> E[CCPA Compliance]
A --> F[PIPEDA Compliance]
A --> G[LGPD Compliance]
A --> H[South African Compliance]
I[Automated Reporting] --> A
I --> B
I --> C
I --> D
I --> E
I --> F
I --> G
I --> H
J[Quantum IoT Integration] --> A
J --> K[MQTT Broker]
A --> L[Health Check: curl -f http://localhost:4086/health]
B --> M[Health Check: curl -f http://localhost:4080/health]
C --> N[Health Check: curl -f http://localhost:4081/health]
```

**Diagram sources**
- [docker-compose.compliance.yml](file://vessels/docker-compose.compliance.yml)

**Section sources**
- [docker-compose.compliance.yml](file://vessels/docker-compose.compliance.yml)

### Service-Specific Configuration Example: Azora Mint
The azora-mint service demonstrates a complete service-specific containerization configuration with MongoDB dependency.

```mermaid
classDiagram
class AzoraMint {
+container_name : azora-mint
+port : 3006 : 3006
+environment : NODE_ENV, PORT, MONGODB_URI
+dependsOn : mongodb
+network : azora-network
+restart : unless-stopped
+volume : ./logs : /app/logs
+healthcheck : curl -f http : //localhost : 3006/api/health/ready
}
class MongoDB {
+image : mongo : 7-jammy
+container_name : azora-mint-mongodb
+port : 27019 : 27017
+environment : MONGO_INITDB_DATABASE
+volume : mongodb_data : /data/db
+volume : ./docker/init-mongo.js : /docker-entrypoint-initdb.d/init-mongo.js
+healthcheck : mongosh --eval db.adminCommand('ping')
}
AzoraMint --> MongoDB : "depends on"
```

**Diagram sources**
- [azora-mint/docker-compose.yml](file://services/azora-mint/docker-compose.yml)

**Section sources**
- [azora-mint/docker-compose.yml](file://services/azora-mint/docker-compose.yml)

### Service-Specific Configuration Example: AI Website Builder
The AI website builder service includes specialized requirements for browser automation.

```mermaid
flowchart TD
A[Build Stage] --> B[Install Chromium Dependencies]
B --> C[Install Production Dependencies]
C --> D[Copy Source Code]
D --> E[Production Stage]
E --> F[Install System Dependencies]
F --> G[Create Non-Root User]
G --> H[Copy Built Dependencies]
H --> I[Copy Source Code]
I --> J[Create Directories]
J --> K[Set Permissions]
K --> L[Run as NodeJS User]
L --> M[Start Application]
style A fill:#f9f,stroke:#333
style E fill:#f9f,stroke:#333
```

**Diagram sources**
- [ai-website-builder/docker-compose.yml](file://organs/ai-website-builder/docker-compose.yml)
- [Dockerfile](file://organs/ai-website-builder/docker/Dockerfile)

**Section sources**
- [ai-website-builder/docker-compose.yml](file://organs/ai-website-builder/docker-compose.yml)

## Dependency Analysis
The containerization strategy reveals a complex dependency graph where services depend on each other for functionality. The main application depends on various AI services, while specialized services like compliance and monitoring have their own dependency chains. Database services are shared across multiple applications, creating a centralized data layer. The system uses Docker networks to manage service communication and environment variables for configuration.

```mermaid
graph TD
A[Main App] --> B[AI Personalization]
A --> C[AI Sentiment]
A --> D[AI Chatbot]
A --> E[AI Vision]
F[Compliance Dashboard] --> G[GDPR Compliance]
F --> H[HIPAA Compliance]
F --> I[SOX Compliance]
F --> J[CCPA Compliance]
F --> K[PIPEDA Compliance]
F --> L[LGPD Compliance]
F --> M[South African Compliance]
N[Automated Reporting] --> F
N --> G
N --> H
N --> I
N --> J
N --> K
N --> L
N --> M
O[Tracing & Recovery] --> P[Redis]
O --> Q[Postgres]
R[Snapshot Scheduler] --> O
S[Zero Rating] --> P
T[5G Manager] --> P
T --> Q
U[Azora Mint] --> V[MongoDB]
W[AI Website Builder] --> X[MongoDB]
Y[Prometheus] --> Z[Node Exporter]
AA[Grafana] --> Y
AB[Alertmanager] --> Y
```

**Diagram sources**
- [docker-compose.yml](file://vessels/docker-compose.yml)
- [docker-compose.prod.yml](file://vessels/docker-compose.prod.yml)
- [docker-compose.production.yml](file://vessels/docker-compose.production.yml)
- [docker-compose.monitoring.yml](file://vessels/docker-compose.monitoring.yml)
- [docker-compose.autonomous.yml](file://vessels/docker-compose.autonomous.yml)
- [docker-compose.compliance.yml](file://vessels/docker-compose.compliance.yml)
- [azora-mint/docker-compose.yml](file://services/azora-mint/docker-compose.yml)
- [ai-website-builder/docker-compose.yml](file://organs/ai-website-builder/docker-compose.yml)

**Section sources**
- [vessels/](file://vessels/)
- [services/](file://services/)
- [organs/](file://organs/)

## Performance Considerations
The containerization strategy incorporates several performance optimizations. Multi-stage Docker builds reduce image sizes by separating build and production environments. Health checks ensure service reliability and enable automatic recovery. Resource limits in production configurations prevent any single service from consuming excessive resources. The monitoring stack provides visibility into service performance, allowing for data-driven optimization decisions. Service dependencies are carefully managed to minimize startup time and ensure proper initialization order.

**Section sources**
- [Dockerfile](file://organs/ai-website-builder/docker/Dockerfile)
- [Dockerfile](file://services/azora-mint/docker/Dockerfile)
- [docker-compose.production.yml](file://vessels/docker-compose.production.yml)

## Troubleshooting Guide
When troubleshooting containerization issues, consider the following common scenarios:

1. **Service fails to start**: Check container logs with `docker logs <container_name>` and verify environment variables and dependencies.

2. **Health checks failing**: Ensure the service is properly exposing the health endpoint and that dependencies are available.

3. **Database connection issues**: Verify database service is running and connection strings are correct.

4. **Port conflicts**: Check for port conflicts with other services or host applications.

5. **Volume mounting issues**: Ensure host paths exist and have proper permissions.

6. **Network connectivity problems**: Verify services are on the same network and can resolve each other's hostnames.

Use the monitoring stack (Prometheus, Grafana, Alertmanager) to identify performance bottlenecks and service degradation.

**Section sources**
- [docker-compose.monitoring.yml](file://vessels/docker-compose.monitoring.yml)
- [docker-compose.yml](file://vessels/docker-compose.yml)
- [docker-compose.prod.yml](file://vessels/docker-compose.prod.yml)

## Conclusion
Azora OS's containerization strategy provides a robust foundation for deploying and managing its complex microservices architecture. Through specialized docker-compose configurations for different operational modes, the system achieves flexibility, reliability, and scalability. The implementation demonstrates best practices in containerization, including multi-stage builds, health checks, proper networking, and comprehensive monitoring. This approach enables efficient development, reliable production deployments, and effective system observability.