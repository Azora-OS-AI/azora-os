# Deployment Configurations

<cite>
**Referenced Files in This Document**   
- [main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [main-app-hpa.yaml](file://biome/main-app-hpa.yaml)
- [main-app-probes.yaml](file://biome/main-app-probes.yaml)
- [app-secrets.yaml](file://biome/app-secrets.yaml)
- [monitoring-stack.yaml](file://biome/monitoring-stack.yaml)
- [ai-personalization-deployment.yaml](file://biome/ai-personalization-deployment.yaml)
- [ai-personalization-hpa.yaml](file://biome/ai-personalization-hpa.yaml)
- [ai-personalization-probes.yaml](file://biome/ai-personalization-probes.yaml)
- [prometheus.yml](file://infrastructure/monitoring/prometheus.yml)
- [alertmanager.yml](file://infrastructure/monitoring/alertmanager.yml)
- [MONITORING.md](file://codex/MONITORING.md)
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
This document provides comprehensive guidance on deployment configurations in Azora OS, focusing on environment-specific settings managed through YAML files in the biome directory. It details the implementation of application deployments, horizontal pod autoscalers (HPA), and health probes, with practical examples for configuring application secrets, resource scaling policies, and monitoring stack components. The document also explains how these configurations contribute to system resilience and service availability.

## Project Structure

The biome directory contains all deployment configuration files for Azora OS, organized by service and configuration type. Each service has dedicated YAML files for deployment, horizontal pod autoscaling, and health probes, ensuring separation of concerns and easier management.

```mermaid
graph TD
Biome[bime directory]
Biome --> MAD[main-app-deployment.yaml]
Biome --> MAH[main-app-hpa.yaml]
Biome --> MAP[main-app-probes.yaml]
Biome --> ASD[app-secrets.yaml]
Biome --> MS[monitoring-stack.yaml]
Biome --> APD[ai-personalization-deployment.yaml]
Biome --> APH[ai-personalization-hpa.yaml]
Biome --> APP[ai-personalization-probes.yaml]
Biome --> FD[fluentd-daemonset.yaml]
```

**Diagram sources**
- [main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [ai-personalization-deployment.yaml](file://biome/ai-personalization-deployment.yaml)
- [monitoring-stack.yaml](file://biome/monitoring-stack.yaml)

**Section sources**
- [biome](file://biome)

## Core Components

The deployment configuration system in Azora OS consists of several core components that work together to ensure reliable and scalable application deployment. These include deployment manifests, horizontal pod autoscalers, health probes, secret management, and monitoring infrastructure.

**Section sources**
- [main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [main-app-hpa.yaml](file://biome/main-app-hpa.yaml)
- [main-app-probes.yaml](file://biome/main-app-probes.yaml)
- [app-secrets.yaml](file://biome/app-secrets.yaml)
- [monitoring-stack.yaml](file://biome/monitoring-stack.yaml)

## Architecture Overview

The deployment architecture in Azora OS follows a microservices pattern with Kubernetes-native configuration management. Each service is independently deployable with its own scaling policies and health checks, while sharing common infrastructure components like monitoring and secret management.

```mermaid
graph LR
subgraph "Application Layer"
A[Main Application]
B[AI Personalization Service]
end
subgraph "Scaling Layer"
C[Horizontal Pod Autoscaler]
D[Resource Metrics]
end
subgraph "Observability Layer"
E[Prometheus]
F[Grafana]
G[AlertManager]
end
subgraph "Security Layer"
H[Secrets Management]
I[Environment Variables]
end
A --> C
B --> C
C --> D
A --> E
B --> E
E --> F
E --> G
A --> H
B --> H
H --> I
```

**Diagram sources**
- [main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [main-app-hpa.yaml](file://biome/main-app-hpa.yaml)
- [monitoring-stack.yaml](file://biome/monitoring-stack.yaml)
- [app-secrets.yaml](file://biome/app-secrets.yaml)

## Detailed Component Analysis

### Application Deployment Configuration

The application deployment configuration defines the desired state for application pods, including container specifications, replicas, and network settings. The main application deployment specifies two replicas with environment variables for production configuration.

```mermaid
classDiagram
class Deployment {
+string apiVersion
+string kind
+Object metadata
+Object spec
+string metadata.name
+int spec.replicas
+Object spec.selector
+Object spec.template
}
class Container {
+string name
+string image
+int[] ports
+Object[] env
}
class Service {
+string apiVersion
+string kind
+Object metadata
+Object spec
+string spec.type
+Object[] spec.ports
+Object spec.selector
}
Deployment --> Container : "contains"
Deployment --> Service : "exposes"
```

**Diagram sources**
- [main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [ai-personalization-deployment.yaml](file://biome/ai-personalization-deployment.yaml)

**Section sources**
- [main-app-deployment.yaml](file://biome/main-app-deployment.yaml#L1-L36)
- [ai-personalization-deployment.yaml](file://biome/ai-personalization-deployment.yaml#L1-L31)

### Horizontal Pod Autoscaler Implementation

The Horizontal Pod Autoscaler (HPA) automatically scales the number of pods based on observed CPU utilization. The main application HPA maintains between 2 and 10 replicas, scaling when CPU usage averages 50% across pods. The AI personalization service has a higher threshold of 60% CPU utilization due to its computational nature.

```mermaid
sequenceDiagram
participant Metrics as Metrics Server
participant HPA as HorizontalPodAutoscaler
participant API as Kubernetes API
participant Pods as Pod Instances
loop Every 15 seconds
Metrics->>HPA : Report CPU utilization
end
HPA->>HPA : Calculate desired replicas
alt CPU > 50%
HPA->>API : Scale up
API->>Pods : Create new pods
else CPU < 30%
HPA->>API : Scale down
API->>Pods : Terminate pods
else Stable
Note over HPA : Maintain current replicas
end
```

**Diagram sources**
- [main-app-hpa.yaml](file://biome/main-app-hpa.yaml)
- [ai-personalization-hpa.yaml](file://biome/ai-personalization-hpa.yaml)

**Section sources**
- [main-app-hpa.yaml](file://biome/main-app-hpa.yaml#L1-L18)
- [ai-personalization-hpa.yaml](file://biome/ai-personalization-hpa.yaml#L1-L18)

### Health Probes Configuration

Health probes ensure application reliability by monitoring liveness and readiness. The main application uses HTTP probes on port 3000 with a 30-second initial delay for liveness and 10-second delay for readiness. The AI personalization service uses a dedicated /health endpoint on port 3010.

```mermaid
flowchart TD
Start([Pod Start]) --> LivenessCheck["Liveness Probe: / (port 3000)"]
Start --> ReadinessCheck["Readiness Probe: / (port 3000)"]
LivenessCheck --> LivenessSuccess{"HTTP 200?"}
LivenessSuccess --> |Yes| ContinueLiveness
LivenessSuccess --> |No| RestartPod["Restart Container"]
RestartPod --> Start
ReadinessCheck --> ReadinessSuccess{"HTTP 200?"}
ReadinessSuccess --> |Yes| MarkReady["Mark Pod Ready"]
ReadinessSuccess --> |No| KeepUnready["Keep Pod Unready"]
MarkReady --> ServeTraffic["Add to Service Endpoints"]
KeepUnready --> Wait["Wait for Next Check"]
ContinueLiveness --> NormalOperation["Normal Operation"]
```

**Diagram sources**
- [main-app-probes.yaml](file://biome/main-app-probes.yaml)
- [ai-personalization-probes.yaml](file://biome/ai-personalization-probes.yaml)

**Section sources**
- [main-app-probes.yaml](file://biome/main-app-probes.yaml#L1-L21)
- [ai-personalization-probes.yaml](file://biome/ai-personalization-probes.yaml#L1-L21)

### Secret Management

Application secrets are securely managed using Kubernetes Secrets. The app-secrets.yaml file contains base64-encoded values for sensitive information like JWT secrets and database URLs, preventing exposure in configuration files.

```mermaid
classDiagram
class Secret {
+string apiVersion
+string kind
+Object metadata
+string type
+Object data
}
class Application {
+string name
+string image
}
class Environment {
+string name
+string valueFrom
}
Application --> Environment : "uses"
Environment --> Secret : "references"
Secret --> data : "contains"
note right of Secret
Data stored in base64 encoding
JWT_SECRET : c3VwZXJzZWNyZXQ=
DATABASE_URL : cG9zdGdyZXM6Ly91c2VyOnBhc3NAaG9zdC9kYg==
end note
```

**Diagram sources**
- [app-secrets.yaml](file://biome/app-secrets.yaml)

**Section sources**
- [app-secrets.yaml](file://biome/app-secrets.yaml#L1-L8)

### Monitoring Stack Configuration

The monitoring stack provides comprehensive observability with Prometheus for metrics collection, Grafana for visualization, and AlertManager for notifications. All components are deployed in a dedicated monitoring namespace with appropriate services and endpoints.

```mermaid
graph TD
subgraph Monitoring["Monitoring Namespace"]
P[Prometheus]
G[Grafana]
A[AlertManager]
end
S1[Main Application] --> P
S2[AI Personalization] --> P
S3[API Gateway] --> P
S4[Email Service] --> P
S5[Messaging Service] --> P
P --> G
P --> A
A --> Email[Email Notifications]
A --> Slack[Slack Alerts]
G --> Dashboard[Operational Dashboards]
style Monitoring fill:#f9f,stroke:#333
```

**Diagram sources**
- [monitoring-stack.yaml](file://biome/monitoring-stack.yaml)
- [prometheus.yml](file://infrastructure/monitoring/prometheus.yml)
- [alertmanager.yml](file://infrastructure/monitoring/alertmanager.yml)

**Section sources**
- [monitoring-stack.yaml](file://biome/monitoring-stack.yaml#L1-L70)
- [prometheus.yml](file://infrastructure/monitoring/prometheus.yml#L1-L89)
- [alertmanager.yml](file://infrastructure/monitoring/alertmanager.yml#L1-L35)

## Dependency Analysis

The deployment configurations have several key dependencies that ensure proper functionality and integration across the system.

```mermaid
graph LR
AD[Application Deployment] --> HPA[Horizontal Pod Autoscaler]
HPA --> RM[Resource Metrics]
AD --> HP[Health Probes]
HP --> MC[Monitoring Components]
AD --> SM[Secrets Management]
SM --> EV[Environment Variables]
MC --> P[Prometheus]
P --> G[Grafana]
P --> AM[AlertManager]
AM --> NC[Notification Channels]
style AD fill:#ccf,stroke:#333
style HPA fill:#cfc,stroke:#333
style HP fill:#cfc,stroke:#333
style SM fill:#cfc,stroke:#333
style MC fill:#cfc,stroke:#333
```

**Diagram sources**
- [main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [main-app-hpa.yaml](file://biome/main-app-hpa.yaml)
- [main-app-probes.yaml](file://biome/main-app-probes.yaml)
- [app-secrets.yaml](file://biome/app-secrets.yaml)
- [monitoring-stack.yaml](file://biome/monitoring-stack.yaml)

**Section sources**
- [main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [main-app-hpa.yaml](file://biome/main-app-hpa.yaml)
- [main-app-probes.yaml](file://biome/main-app-probes.yaml)
- [app-secrets.yaml](file://biome/app-secrets.yaml)
- [monitoring-stack.yaml](file://biome/monitoring-stack.yaml)

## Performance Considerations

The deployment configurations are designed with performance and scalability in mind. The HPA settings balance responsiveness with stability, avoiding rapid scaling fluctuations. The monitoring stack is configured with appropriate scrape intervals to minimize overhead while maintaining timely metrics collection.

**Section sources**
- [main-app-hpa.yaml](file://biome/main-app-hpa.yaml)
- [prometheus.yml](file://infrastructure/monitoring/prometheus.yml)

## Troubleshooting Guide

Common deployment issues and their solutions include:

- **Pods not starting**: Check secret decoding and environment variable configuration
- **HPA not scaling**: Verify metrics server availability and CPU usage thresholds
- **Health probes failing**: Validate application endpoints and probe timing settings
- **Monitoring gaps**: Confirm scrape configurations and service discovery settings

**Section sources**
- [main-app-probes.yaml](file://biome/main-app-probes.yaml)
- [monitoring-stack.yaml](file://biome/monitoring-stack.yaml)
- [prometheus.yml](file://infrastructure/monitoring/prometheus.yml)

## Conclusion

The deployment configurations in Azora OS provide a robust foundation for reliable and scalable application deployment. By leveraging Kubernetes-native features like deployments, horizontal pod autoscalers, and health probes, the system ensures high availability and automatic adaptation to changing load conditions. The integration with a comprehensive monitoring stack enables proactive issue detection and resolution, while secure secret management protects sensitive configuration data. These configurations can be adapted for different environments by modifying replica counts, resource limits, and scaling thresholds based on specific requirements and traffic patterns.