# MindBridge - Mental Health Support Platform

## Overview

MindBridge is a comprehensive mental health support platform designed specifically for college students. The application provides anonymous self-assessment tools, mood tracking, community forums, and access to campus mental health resources. Built with privacy as a core principle, the platform ensures complete user anonymity while delivering evidence-based mental health support tools including GAD-7 anxiety assessments, mood tracking with visualization, peer support communities, and crisis intervention resources.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing without the overhead of React Router
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility and customization
- **Styling**: Tailwind CSS with CSS variables for consistent theming and dark mode support
- **Build Tool**: Vite for fast development and optimized production builds
- **State Management**: TanStack Query (React Query) for server state management and caching

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **Database**: PostgreSQL with Neon serverless hosting for scalability
- **Session Management**: Anonymous session handling using localStorage with generated session IDs
- **Development**: Hot module replacement and development server integration through Vite middleware

### Data Storage Solutions
- **Primary Database**: PostgreSQL with the following schema design:
  - `assessments`: Stores mental health assessment responses and scores
  - `mood_entries`: Tracks daily mood, stress levels, and sleep data
  - `forum_posts`: Community forum posts with moderation capabilities
  - `forum_replies`: Threaded replies to forum posts
  - `resources`: Mental health educational resources and articles
  - `campus_services`: Directory of campus mental health services
- **Client Storage**: Browser localStorage for anonymous session persistence
- **Data Privacy**: No personally identifiable information stored; all data tied to anonymous session IDs

### Authentication and Authorization
- **Anonymous Sessions**: Client-side generated session IDs for data association without user accounts
- **Privacy-First Design**: No login system, no personal data collection, no tracking
- **Session Persistence**: Local storage maintains continuity across browser sessions
- **Data Isolation**: Each anonymous session maintains separate data boundaries

### API Design Patterns
- **RESTful Endpoints**: Standard HTTP methods for CRUD operations
- **Input Validation**: Zod schemas for request validation and type safety
- **Error Handling**: Centralized error middleware with appropriate HTTP status codes
- **Response Structure**: Consistent JSON response format across all endpoints
- **Route Organization**: Modular route handlers separated by feature domain

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **Connection Pooling**: Built-in connection management for production workloads

### UI and Design Libraries
- **Radix UI**: Headless UI components for accessibility and keyboard navigation
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Data visualization library for mood tracking charts and analytics
- **Class Variance Authority**: Utility for component variant management

### Development and Build Tools
- **TypeScript**: Static typing for enhanced developer experience and code reliability
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Replit Integration**: Development environment optimization with error overlays and debugging tools

### Mental Health Resources
- **Crisis Hotlines**: Integration with 988 Suicide & Crisis Lifeline and Crisis Text Line
- **Assessment Tools**: Implementation of standardized mental health assessments (GAD-7, PHQ-9)
- **Educational Content**: Curated mental health resources and coping strategies