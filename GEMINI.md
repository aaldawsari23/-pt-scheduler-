# GEMINI.md

## Project Overview

This project is a Physical Therapy Scheduler application named "مجدول العلاج الطبيعي". It is designed for the King Abdullah Hospital in Bisha, specifically for the Medical Rehabilitation Center's physical therapy department. The application is built using React, Vite, and TypeScript, and the user interface is primarily in Arabic. It provides a scheduling system for managing appointments, with different views (day, week, month) and functionalities for booking, managing providers, and handling different types of appointments (urgent, normal, etc.).

The application uses a context-based state management approach (`AppContext`) to handle global state for appointments, providers, settings, and other application-wide data. It also includes features like a home exercise program (HEP) library, settings management, and manual booking.

## Building and Running

To build and run this project, you need to have Node.js installed.

**1. Install Dependencies:**

```bash
npm install
```

**2. Set Environment Variables:**

Create a `.env.local` file in the root of the project and add the following line, replacing `YOUR_API_KEY` with your actual Gemini API key:

```
GEMINI_API_KEY=YOUR_API_KEY
```

**3. Run the Development Server:**

```bash
npm run dev
```

This will start the Vite development server, and you can view the application in your browser at the address provided.

**4. Build for Production:**

```bash
npm run build
```

This command will create a `dist` directory with the production-ready files.

**5. Preview the Production Build:**

```bash
npm run preview
```

This will serve the `dist` directory, allowing you to preview the production build locally.

## Development Conventions

*   **State Management:** The project uses React's Context API for global state management. The main context is `AppContext`, which provides data and functions to the entire application.
*   **Component Structure:** Components are organized into `components`, with subdirectories for common components, modals, and views.
*   **Styling:** The project uses Tailwind CSS for styling, as indicated by the class names used in the components.
*   **Types:** TypeScript types are defined in the `types.ts` file.
*   **Utils:** Utility functions, such as date manipulation and helper functions, are located in the `utils` directory.
*   **Routing:** The application does not use a dedicated routing library like React Router. Instead, it uses a single-page interface with conditional rendering of different views based on the state.
*   **Internationalization:** The application supports both Arabic and English, with the language being managed in the settings. The UI is primarily in Arabic.

## Implementation Note:

The main change was the consolidation of the `DayView`, `WeekView`, and `MonthView` components into a single `Calendar` component located in `components/views/Calendar.tsx`. This new component is responsible for rendering the different calendar views (day, week, and month) and handling user interactions.

The `Scheduler.tsx` component was refactored to use the new `Calendar` component, and the view-specific logic was moved to the `Calendar` component.

The `createAppointment` and `findAndBookSlot` functions were moved from `Scheduler.tsx` to `AppContext.tsx` to be available globally.

The `BookingBar.tsx` component was updated to use the `findAndBookSlot` and `fileNo` from the `AppContext`.

The old view files (`DayView.tsx`, `WeekView.tsx`, and `MonthView.tsx`) were deleted.

The `StatsBar.tsx` component was not changed as it already gets all the data it needs from the `useAppContext` hook.
