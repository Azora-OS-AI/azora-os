# Marketplace UI

<cite>
**Referenced Files in This Document**   
- [App.tsx](file://marketplace-ui/src/App.tsx)
- [AuthContext.jsx](file://marketplace-ui/src/contexts/AuthContext.jsx)
- [ThemeContext.jsx](file://marketplace-ui/src/contexts/ThemeContext.jsx)
- [AuthLayout.jsx](file://marketplace-ui/src/components/layout/AuthLayout.jsx)
- [MainLayout.jsx](file://marketplace-ui/src/components/layout/MainLayout.jsx)
- [AIAssistantPanel.jsx](file://marketplace-ui/src/pages/services/AIAssistantPanel.jsx)
- [CompliancePanel.jsx](file://marketplace-ui/src/pages/services/CompliancePanel.jsx)
- [AnalyticsPanel.jsx](file://marketplace-ui/src/pages/services/AnalyticsPanel.jsx)
- [Dashboard.tsx](file://marketplace-ui/src/components/panels/Dashboard.tsx)
- [Header.tsx](file://marketplace-ui/src/components/shared/Header.tsx)
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
The Marketplace UI in Azora OS serves as a centralized service marketplace that provides access to specialized AI-driven and compliance-oriented services. This document details the implementation of the Marketplace UI, focusing on its modular architecture, state management, authentication flow, and responsive design principles. The UI enables users to interact with various service panels including AI Assistant, Compliance, Analytics, and other domain-specific modules through a unified interface.

## Project Structure

```mermaid
graph TB
MarketplaceUI[Marketplace UI] --> Components
MarketplaceUI --> Contexts
MarketplaceUI --> Hooks
MarketplaceUI --> Pages
MarketplaceUI --> App
MarketplaceUI --> Main
Components --> Layout
Components --> Panels
Components --> Shared
Components --> UI
Components --> GenericServicePanel
Components --> ServicePanel
Layout --> AuthLayout
Layout --> MainLayout
Panels --> Dashboard
Panels --> AlertsPanel
Panels --> ReportsPanel
Panels --> MetricsPanel
Shared --> Header
Shared --> Sidebar
Shared --> FrameworkStatusGrid
Shared --> RecentActivity
Pages --> Auth
Pages --> Services
Pages --> Dashboard
Pages --> Onboarding
Pages --> Subscription
Auth --> Login
Auth --> Signup
Auth --> ForgotPassword
Services --> AIAssistantPanel
Services --> CompliancePanel
Services --> AnalyticsPanel
Services --> OtherServicePanels
Contexts --> AuthContext
Contexts --> ThemeContext
Hooks --> use-mobile
```

**Diagram sources**
- [App.tsx](file://marketplace-ui/src/App.tsx)
- [components/](file://marketplace-ui/src/components/)
- [pages/](file://marketplace-ui/src/pages/)
- [contexts/](file://marketplace-ui/src/contexts/)

**Section sources**
- [App.tsx](file://marketplace-ui/src/App.tsx)
- [components/](file://marketplace-ui/src/components/)
- [pages/](file://marketplace-ui/src/pages/)

## Core Components

The Marketplace UI is built around several core components that enable modularity, reusability, and consistent user experience across different service domains. These include layout wrappers (AuthLayout, MainLayout), shared UI elements (Header, Sidebar), service-specific panels (AIAssistantPanel, CompliancePanel), and state management contexts (AuthContext, ThemeContext). The component architecture supports dynamic rendering of service panels based on user navigation and authentication state.

**Section sources**
- [App.tsx](file://marketplace-ui/src/App.tsx)
- [components/layout/AuthLayout.jsx](file://marketplace-ui/src/components/layout/AuthLayout.jsx)
- [components/layout/MainLayout.jsx](file://marketplace-ui/src/components/layout/MainLayout.jsx)
- [contexts/AuthContext.jsx](file://marketplace-ui/src/contexts/AuthContext.jsx)

## Architecture Overview

```mermaid
graph TD
A[User Interaction] --> B[UI Components]
B --> C[React State]
C --> D[Context Providers]
D --> E[AuthContext]
D --> F[ThemeContext]
E --> G[LocalStorage]
E --> H[Backend API]
F --> I[LocalStorage]
B --> J[API Calls]
J --> K[Backend Services]
K --> L[Athora Nexus]
K --> M[Citadel Compliance]
K --> N[Analytics Engine]
B --> O[Dynamic Panel Rendering]
O --> P[Lazy Loading]
P --> Q[Code Splitting]
B --> R[Responsive Design]
R --> S[Mobile-First Approach]
```

**Diagram sources**
- [App.tsx](file://marketplace-ui/src/App.tsx)
- [contexts/AuthContext.jsx](file://marketplace-ui/src/contexts/AuthContext.jsx)
- [components/panels/Dashboard.tsx](file://marketplace-ui/src/components/panels/Dashboard.tsx)

## Detailed Component Analysis

### Layout Components

#### AuthLayout and MainLayout
The Marketplace UI utilizes two primary layout components: AuthLayout for authentication screens and MainLayout for authenticated views. AuthLayout provides a centered, modal-like presentation with animation effects using Framer Motion, while MainLayout implements a sidebar navigation pattern with responsive spacing.

```mermaid
classDiagram
class AuthLayout {
+children : ReactNode
-render() : JSX.Element
}
class MainLayout {
+children : ReactNode
-render() : JSX.Element
}
AuthLayout --> "1" Header : contains
AuthLayout --> "1" Sidebar : contains
MainLayout --> "1" Sidebar : contains
MainLayout --> "1" Header : contains
```

**Diagram sources**
- [components/layout/AuthLayout.jsx](file://marketplace-ui/src/components/layout/AuthLayout.jsx)
- [components/layout/MainLayout.jsx](file://marketplace-ui/src/components/layout/MainLayout.jsx)

**Section sources**
- [components/layout/AuthLayout.jsx](file://marketplace-ui/src/components/layout/AuthLayout.jsx)
- [components/layout/MainLayout.jsx](file://marketplace-ui/src/components/layout/MainLayout.jsx)

### Service Panels

#### AI Assistant Panel Implementation
The AIAssistantPanel demonstrates a lightweight service panel implementation that leverages the GenericServicePanel component for consistent styling and layout. It represents one of many specialized service interfaces available in the marketplace.

```mermaid
flowchart TD
Start([AIAssistantPanel Render]) --> UseGenericPanel["Use GenericServicePanel"]
UseGenericPanel --> ConfigureProps["Configure with title: 'AI Assistant'"]
ConfigureProps --> SetDescription["Set description: 'Intelligent virtual assistant and automation'"]
SetDescription --> SpecifyServiceType["Specify serviceType: 'AI Assistant'"]
SpecifyServiceType --> RenderOutput["Render Output"]
RenderOutput --> End([Panel Displayed])
```

**Diagram sources**
- [pages/services/AIAssistantPanel.jsx](file://marketplace-ui/src/pages/services/AIAssistantPanel.jsx)

**Section sources**
- [pages/services/AIAssistantPanel.jsx](file://marketplace-ui/src/pages/services/AIAssistantPanel.jsx)

#### Compliance Panel Architecture
The CompliancePanel represents a complex service panel with comprehensive state management, API integration, and interactive controls for managing global economic instantiation protocols. It fetches data from the Citadel compliance backend and enables country-level activation workflows.

```mermaid
sequenceDiagram
participant User
participant CompliancePanel
participant BackendAPI
participant State
User->>CompliancePanel : Navigate to Compliance Panel
CompliancePanel->>BackendAPI : GET /api/citadel/genesis/status
BackendAPI-->>CompliancePanel : Return genesis status
CompliancePanel->>State : Update genesisStatus
CompliancePanel->>BackendAPI : GET /api/citadel/economies
BackendAPI-->>CompliancePanel : Return economies list
CompliancePanel->>State : Update countries
User->>CompliancePanel : Select Country
CompliancePanel->>BackendAPI : GET /api/citadel/grants/{country}
BackendAPI-->>CompliancePanel : Return country data
CompliancePanel->>State : Update countryData
User->>CompliancePanel : Trigger Activation Check
CompliancePanel->>BackendAPI : POST /api/citadel/triggers/check
BackendAPI-->>CompliancePanel : Return trigger result
CompliancePanel->>State : Update accordingly
```

**Diagram sources**
- [pages/services/CompliancePanel.jsx](file://marketplace-ui/src/pages/services/CompliancePanel.jsx)

**Section sources**
- [pages/services/CompliancePanel.jsx](file://marketplace-ui/src/pages/services/CompliancePanel.jsx)

#### Analytics Panel Data Flow
The AnalyticsPanel demonstrates integration with the Azora Nexus analytics backend, showing user metrics, conversion funnels, and top-performing pages. It uses the AuthContext to access user authentication tokens for authorized API requests.

```mermaid
flowchart LR
A[AnalyticsPanel Mount] --> B[useAuth Hook]
B --> C{User Authenticated?}
C --> |Yes| D[Fetch with Bearer Token]
C --> |No| E[Show Loading State]
D --> F[GET /api/analytics/dashboard]
F --> G{Response OK?}
G --> |Yes| H[Set analyticsData]
G --> |No| I[Use Mock Data]
H --> J[Render Metrics]
I --> J
J --> K[Display User Metrics]
J --> L[Display Top Pages]
J --> M[Display Conversion Funnel]
```

**Diagram sources**
- [pages/services/AnalyticsPanel.jsx](file://marketplace-ui/src/pages/services/AnalyticsPanel.jsx)
- [contexts/AuthContext.jsx](file://marketplace-ui/src/contexts/AuthContext.jsx)

**Section sources**
- [pages/services/AnalyticsPanel.jsx](file://marketplace-ui/src/pages/services/AnalyticsPanel.jsx)

### State Management System

#### Authentication Context Implementation
The AuthContext provides centralized authentication state management using React Context API, enabling persistent user sessions through localStorage persistence.

```mermaid
classDiagram
class AuthContext {
-user : User | null
-token : string | null
-loading : boolean
+login(email, password)
+logout()
+signup(userData)
}
class User {
+id : string
+email : string
+name : string
+onboardingComplete : boolean
+role : string
}
AuthContext --> User
Component --> AuthContext : consumes
AuthContext --> LocalStorage : persists
AuthContext --> BackendAPI : authenticates
```

**Diagram sources**
- [contexts/AuthContext.jsx](file://marketplace-ui/src/contexts/AuthContext.jsx)

**Section sources**
- [contexts/AuthContext.jsx](file://marketplace-ui/src/contexts/AuthContext.jsx)

#### Theme Context Management
The ThemeContext manages UI theme preferences with automatic persistence to localStorage, supporting dark/light mode toggling across the application.

```mermaid
stateDiagram-v2
[*] --> Initial
Initial --> CheckStorage : On Mount
CheckStorage --> DarkMode : If saved theme is dark
CheckStorage --> LightMode : If saved theme is light
CheckStorage --> DarkMode : If no saved theme
DarkMode --> Toggle : User clicks toggle
Toggle --> LightMode : Switch to light
LightMode --> Toggle : User clicks toggle
Toggle --> DarkMode : Switch to dark
DarkMode --> SaveStorage : Save to localStorage
LightMode --> SaveStorage : Save to localStorage
```

**Diagram sources**
- [contexts/ThemeContext.jsx](file://marketplace-ui/src/contexts/ThemeContext.jsx)

**Section sources**
- [contexts/ThemeContext.jsx](file://marketplace-ui/src/contexts/ThemeContext.jsx)

## Dependency Analysis

```mermaid
graph TD
App --> AuthContext
App --> ThemeContext
App --> Header
App --> Sidebar
App --> Dashboard
App --> AlertsPanel
App --> ReportsPanel
App --> MetricsPanel
AuthContext --> LocalStorage
ThemeContext --> LocalStorage
Dashboard --> ComplianceScoreChart
Dashboard --> RegionalComplianceChart
Dashboard --> FrameworkStatusGrid
Dashboard --> RecentActivity
Header --> RefreshCw
Header --> Shield
AIAssistantPanel --> GenericServicePanel
CompliancePanel --> ServicePanel
AnalyticsPanel --> ServicePanel
AnalyticsPanel --> useAuth
```

**Diagram sources**
- [App.tsx](file://marketplace-ui/src/App.tsx)
- [contexts/](file://marketplace-ui/src/contexts/)
- [components/](file://marketplace-ui/src/components/)

**Section sources**
- [App.tsx](file://marketplace-ui/src/App.tsx)
- [contexts/](file://marketplace-ui/src/contexts/)

## Performance Considerations
The Marketplace UI implements several performance optimizations including code splitting through React.lazy for panel components, Suspense for loading states, and efficient state management to minimize re-renders. API data is automatically refreshed at configured intervals (e.g., every 30 seconds for compliance data) to ensure up-to-date information without excessive server requests.

## Troubleshooting Guide
Common issues in the Marketplace UI typically relate to authentication state persistence, API connectivity, and component loading. Ensure localStorage items 'azora-user' and 'azora-token' are properly set after login. Verify backend service availability at configured endpoints (e.g., http://localhost:4000/api/compliance/dashboard). Check network connectivity and CORS configuration if API calls fail. For lazy-loaded components, ensure proper code splitting configuration in the build process.

**Section sources**
- [contexts/AuthContext.jsx](file://marketplace-ui/src/contexts/AuthContext.jsx)
- [App.tsx](file://marketplace-ui/src/App.tsx)

## Conclusion
The Marketplace UI in Azora OS provides a robust, scalable interface for accessing specialized services through a unified dashboard. Its component-based architecture, combined with React Context for state management and responsive design principles, creates an extensible foundation for service integration. The implementation demonstrates effective patterns for authentication persistence, API integration, and dynamic content rendering that can be leveraged across the Azora ecosystem.