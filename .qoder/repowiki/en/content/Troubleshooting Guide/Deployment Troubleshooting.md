# Deployment Troubleshooting

<cite>
**Referenced Files in This Document**   
- [DEPLOYMENT_READINESS.md](file://DEPLOYMENT_READINESS.md)
- [vessels/docker-compose.production.yml](file://vessels/docker-compose.production.yml)
- [infrastructure/k8s/api-gateway.yaml](file://infrastructure/k8s/api-gateway.yaml)
- [biome/main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [biome/app-secrets.yaml](file://biome/app-secrets.yaml)
- [biome/main-app-probes.yaml](file://biome/main-app-probes.yaml)
- [infrastructure/terraform/environments/dev/README.md](file://infrastructure/terraform/environments/dev/README.md)
- [infrastructure/terraform/environments/prod/README.md](file://infrastructure/terraform/environments/prod/README.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Common Deployment Issues](#common-deployment-issues)
3. [Configuration Mismatches and Environment Variables](#configuration-mismatches-and-environment-variables)
4. [Container Networking Problems](#container-networking-problems)
5. [Diagnosing Failed Deployments](#diagnosing-failed-deployments)
6. [Role of DEPLOYMENT_READINESS.md](#role-of-deployment_readinessmd)
7. [Volume Mounting and Secret Management](#volume-mounting-and-secret-management)
8. [Service Dependency Ordering](#service-dependency-ordering)
9. [Step-by-Step Resolution Procedures](#step-by-step-resolution-procedures)

## Introduction
This document provides comprehensive guidance on troubleshooting deployment issues in Azora OS across development and production environments using Docker, Kubernetes, and Terraform. It covers common failure points including configuration errors, container networking issues, secret management, and service dependencies. The document leverages the DEPLOYMENT_READINESS.md checklist as a verification framework and includes diagnostic procedures using logs and readiness probes.

## Common Deployment Issues

### Configuration Mismatches
Configuration mismatches frequently occur when environment-specific settings are not properly applied. The Terraform environment configurations in `infrastructure/terraform/environments/dev/` and `infrastructure/terraform/environments/prod/` contain environment-specific parameters that must align with corresponding Kubernetes manifests and Docker configurations.

### Environment Variable Errors
Environment variable misconfigurations can lead to service failures. The `app-secrets.yaml` file in the biome directory demonstrates how sensitive configuration data should be managed through Kubernetes Secrets rather than direct environment injection.

### Container Networking Problems
Networking issues often stem from incorrect port mappings or network policy configurations. The `api-gateway.yaml` manifest shows proper service exposure through LoadBalancer type with correct port mappings between container and service levels.

**Section sources**
- [infrastructure/terraform/environments/dev/README.md](file://infrastructure/terraform/environments/dev/README.md)
- [infrastructure/terraform/environments/prod/README.md](file://infrastructure/terraform/environments/prod/README.md)
- [biome/app-secrets.yaml](file://biome/app-secrets.yaml)
- [infrastructure/k8s/api-gateway.yaml](file://infrastructure/k8s/api-gateway.yaml)

## Configuration Mismatches and Environment Variables

### Docker Configuration Issues
In Docker deployments, configuration mismatches commonly occur in the `docker-compose.production.yml` file where environment variables like `POSTGRES_PASSWORD`, `DATABASE_URL`, and `REDIS_URL` must be properly sourced from environment files.

```yaml
environment:
  POSTGRES_DB: azora_production
  POSTGRES_USER: azora_user
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  POSTGRES_MAX_CONNECTIONS: 500
```

### Kubernetes Configuration Issues
In Kubernetes environments, configuration is managed through ConfigMaps and Secrets. The `main-app-deployment.yaml` shows environment variables being set directly, while sensitive data should be referenced from Secrets as demonstrated in `app-secrets.yaml`.

### Terraform Environment Management
Terraform manages environment differences through separate configuration directories for development and production, ensuring infrastructure as code consistency across environments.

**Section sources**
- [vessels/docker-compose.production.yml](file://vessels/docker-compose.production.yml)
- [biome/main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [biome/app-secrets.yaml](file://biome/app-secrets.yaml)
- [infrastructure/terraform/environments/dev/README.md](file://infrastructure/terraform/environments/dev/README.md)
- [infrastructure/terraform/environments/prod/README.md](file://infrastructure/terraform/environments/prod/README.md)

## Container Networking Problems

### Service Connectivity Issues
Container networking problems often manifest as services being unable to communicate with each other. The `api-gateway.yaml` configuration shows proper service definition with selector matching deployment labels.

```yaml
spec:
  selector:
    app: api-gateway
  ports:
  - port: 8080
    targetPort: 8080
  type: LoadBalancer
```

### Network Policy Conflicts
Kubernetes network policies must be carefully configured to allow necessary inter-service communication while maintaining security. The absence of restrictive network policies can lead to unexpected connectivity issues in multi-namespace deployments.

**Section sources**
- [infrastructure/k8s/api-gateway.yaml](file://infrastructure/k8s/api-gateway.yaml)

## Diagnosing Failed Deployments

### Log Analysis
Failed deployments can be diagnosed by examining container logs using `kubectl logs <pod-name>` or `docker-compose logs <service-name>`. The autonomous orchestrator system includes built-in logging that should be checked first when diagnosing deployment failures.

### Readiness and Liveness Probes
Health probes are critical for identifying deployment issues. The `main-app-probes.yaml` file demonstrates proper configuration of both readiness and liveness probes:

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

These probes help Kubernetes determine when a container is ready to serve traffic and whether it should be restarted.

**Section sources**
- [biome/main-app-probes.yaml](file://biome/main-app-probes.yaml)

## Role of DEPLOYMENT_READINESS.md

### Pre-Deployment Verification
The `DEPLOYMENT_READINESS.md` file serves as a comprehensive checklist to verify system readiness before deployment. It includes verification of:

- Core system components
- Elara AI system status
- Services and microservices
- Infrastructure configuration
- Security measures
- Performance benchmarks

### Post-Deployment Validation
After deployment, this document provides verification procedures including smoke tests, service health checks, and database connectivity tests to confirm successful deployment.

```bash
# Check all services
kubectl get pods --all-namespaces | grep -v Running
# Should show empty (all running)
```

**Section sources**
- [DEPLOYMENT_READINESS.md](file://DEPLOYMENT_READINESS.md)

## Volume Mounting and Secret Management

### Volume Mounting Issues
Volume mounting problems typically occur when host paths do not exist or have incorrect permissions. The `docker-compose.production.yml` file shows proper volume definitions:

```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
  - ./infrastructure/database-schema.sql:/docker-entrypoint-initdb.d/schema.sql
```

### Secret Management Problems
Improper secret management can cause deployment failures. The `app-secrets.yaml` file demonstrates the correct approach using Kubernetes Secrets with base64-encoded values:

```yaml
apiVersion: v1
kind: Secret
type: Opaque
data:
  JWT_SECRET: c3VwZXJzZWNyZXQ=
  DATABASE_URL: cG9zdGdyZXM6Ly91c2VyOnBhc3NAaG9zdC9kYg==
```

This ensures sensitive data is not exposed in plain text.

**Section sources**
- [vessels/docker-compose.production.yml](file://vessels/docker-compose.production.yml)
- [biome/app-secrets.yaml](file://biome/app-secrets.yaml)

## Service Dependency Ordering

### Docker Dependency Management
In Docker Compose, service dependencies are explicitly defined using the `depends_on` directive. The `docker-compose.production.yml` file shows proper dependency ordering:

```yaml
depends_on:
  - postgres-primary
  - redis
```

### Kubernetes Dependency Considerations
Unlike Docker Compose, Kubernetes does not have a direct equivalent to `depends_on`. Services must be designed to handle dependency failures gracefully, with retry logic and proper health checks.

### Initialization Order
The system must ensure databases and caches are ready before application services start. This is achieved through readiness probes that prevent services from receiving traffic until their dependencies are available.

**Section sources**
- [vessels/docker-compose.production.yml](file://vessels/docker-compose.production.yml)

## Step-by-Step Resolution Procedures

### Configuration Issue Resolution
1. Verify environment variables are properly set in `.env` files
2. Check that Terraform environment configurations match target environment
3. Validate Kubernetes Secrets and ConfigMaps contain correct data
4. Ensure Docker Compose files reference environment variables correctly

### Networking Problem Resolution
1. Verify service selectors match deployment labels
2. Check port mappings between containers and services
3. Validate network policies allow necessary traffic
4. Test connectivity between services using `kubectl exec` and `curl`

### Secret Management Resolution
1. Verify Secrets are properly created in the correct namespace
2. Check that base64 encoding is correctly applied
3. Ensure containers reference Secrets correctly in their specifications
4. Validate that sensitive data is not exposed in logs or error messages

### Dependency Ordering Resolution
1. Implement proper health checks in all services
2. Use init containers in Kubernetes to verify dependencies
3. Add retry logic with exponential backoff in service clients
4. Monitor startup sequences to identify bottlenecks

**Section sources**
- [DEPLOYMENT_READINESS.md](file://DEPLOYMENT_READINESS.md)
- [vessels/docker-compose.production.yml](file://vessels/docker-compose.production.yml)
- [infrastructure/k8s/api-gateway.yaml](file://infrastructure/k8s/api-gateway.yaml)
- [biome/main-app-deployment.yaml](file://biome/main-app-deployment.yaml)
- [biome/app-secrets.yaml](file://biome/app-secrets.yaml)
- [biome/main-app-probes.yaml](file://biome/main-app-probes.yaml)