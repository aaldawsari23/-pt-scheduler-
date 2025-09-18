# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Install dependencies**: `npm install`
- **Start development server**: `npm run dev`
- **Build for production**: `vite build`
- **Preview production build**: `npm run preview`

## Environment Setup

- Requires Node.js
- Set `GEMINI_API_KEY` in `.env.local` for AI features
- The Vite config exposes this as `process.env.GEMINI_API_KEY` in the frontend

## Project Architecture

This is a React + TypeScript physiotherapy (PT) scheduling application built with Vite. The app is designed for Arabic-speaking users and uses RTL layout.

### Core Structure

- **State Management**: Context API with localStorage persistence via `useLocalStorage` hook
- **Main Context**: `AppContext.tsx` manages all application state including providers, appointments, vacations, settings, and audit logs
- **Data Persistence**: All data is stored in localStorage with automatic migrations for settings

### Key Components

- **Scheduler.tsx**: Main orchestrator component with view switching (Day/Week/Month)
- **View Components**: Separate components for different calendar views in `components/views/`
- **Provider Management**: Healthcare providers with specialties (MSK, Neuro, PT-Service)
- **Appointment System**: Supports different appointment types (Normal, Semi-Urgent, Urgent, Chronic, Nearest)

### Data Models

- **Providers**: Healthcare professionals with specialty, working days, and capacity limits
- **Appointments**: Bookings with file numbers, provider assignments, and appointment types
- **Vacations & TimeOffs**: Schedule management for providers
- **Settings**: Configurable booking rules, working hours, and advanced features
- **Audit Log**: Tracks all operations (create, cancel, settings changes) with timestamps

### Specialized Features

- **Home Exercise Program (HEP)**: Built-in exercise content with images for different conditions (facial palsy, low back, knee, neck)
- **Multilingual Support**: Arabic/English toggle with RTL layout
- **Manual Booking**: Direct appointment creation with conflict detection
- **Emergency Slots**: Reserved urgent appointment slots
- **Auto-Distribution**: Intelligent appointment scheduling across providers

### TypeScript Patterns

- Comprehensive type definitions in `types.ts`
- Enum-based constants for specialties and appointment types
- Functional state updates with proper typing for context setters
- Interface-driven development with strict typing

### Utility Functions

- **dateUtils.ts**: Gregorian/Hijri date conversions and calendar operations
- **helpers.ts**: Utility functions including unique ID generation
- **Local Storage Hook**: Type-safe localStorage integration with default values

The application emphasizes Arabic localization, healthcare workflow optimization, and comprehensive appointment management with audit trails.
- to memorise