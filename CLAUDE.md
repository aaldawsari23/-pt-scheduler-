# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Physical Therapy Scheduler** application built in React/TypeScript for healthcare providers. The app is bilingual (Arabic/English) and manages appointment booking, provider schedules, patient management, and home exercise programs for a physiotherapy department.

## Development Commands

- **Install dependencies**: `npm install`
- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Environment Setup

Set `GEMINI_API_KEY` in `.env.local` to your Gemini API key (required for any AI features).

## Architecture

### Core Data Flow
- **Global State**: Managed through `context/AppContext.tsx` using React Context API
- **Persistence**: All data stored in localStorage via `hooks/useLocalStorage.ts`
- **Types**: Comprehensive TypeScript definitions in `types.ts`

### Key Components Structure
```
components/
├── Scheduler.tsx              # Main scheduler component & booking logic
├── BookingBar.tsx            # Top booking interface
├── views/                    # Calendar views (Day/Week/Month)
├── modals/                   # Settings, HEP, Manual booking
└── common/                   # Reusable UI components (Toast, Modal, etc.)
```

### Data Models
- **Provider**: Therapists with specialties (MSK, Neuro, PT-Service), working days, capacity
- **Appointment**: Patient bookings with file numbers, time slots, appointment types
- **Settings**: Global configuration (booking rules, working hours, language, etc.)
- **Additional**: Vacations, TimeOffs, ExtraCapacity, AuditLog

### Appointment Booking System
- **Types**: Normal, SemiUrgent, Urgent, Chronic, Nearest
- **Capacity Management**: Daily limits, urgent reserves, new patient quotas
- **Scheduling Rules**: Configurable days ahead, time blocks, auto-distribution
- **Slot Management**: 15-minute slots, morning/afternoon sessions, provider-specific rules

### Bilingual Support
- Arabic (RTL) and English (LTR) support
- Dynamic direction switching based on `settings.language`
- Arabic interface elements and content

### Home Exercise Program (HEP)
- Exercise library with images and instructions in `constants.ts`
- Predefined content for facial palsy, low back, knee, and neck conditions
- Exercise images stored in `Public/exercises/`

## Constants & Configuration

Key constants in `constants.ts`:
- `INITIAL_PROVIDERS`: Default provider setup
- `INITIAL_SETTINGS`: Default system configuration
- `WORK_HOURS`: Schedule timing (8:00 AM - 3:30 PM)
- `SLOT_DURATION_MINUTES`: 15-minute appointment slots
- `HEP_CONTENT`: Exercise library content

## State Management

All state managed through AppContext providing:
- Provider, appointment, vacation management
- Settings and configuration
- Toast notifications and confirmation dialogs
- Audit logging for tracking changes
- Slot locking mechanism

## UI/UX Patterns

- **Toast System**: Success/error/info notifications with auto-dismiss
- **Confirmation Modals**: For destructive actions
- **Calendar Views**: Day (detailed), Week (overview), Month (navigation)
- **Print Support**: Styled for appointment printouts
- **Responsive Design**: Mobile-friendly interface

## Arabic/Healthcare Context

This application is designed for Arabic-speaking healthcare environments with:
- RTL layout support
- Arabic medical terminology
- Saudi healthcare workflow patterns
- Islamic calendar integration (Hijri dates)
- Local healthcare provider naming conventions
- ADD TO MEMORY