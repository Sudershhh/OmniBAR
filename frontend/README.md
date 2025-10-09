# Frontend - OmniBAR AI Agent Testing Platform

A React frontend for testing and evaluating AI agents using the OmniBAR framework.

## What it does

- Submit AI evaluation requests with custom prompts
- View detailed evaluation results and scores
- Browse evaluation history with filtering
- Monitor performance through dashboard analytics

## Tech Stack

- React 19 with TypeScript
- TanStack Query for data fetching
- Tailwind CSS for styling
- Radix UI components
- Axios for API calls

## Project Structure

```
src/
├── api/           # API client and endpoints
├── components/    # React components
│   ├── dashboard/ # Dashboard and stats
│   ├── evaluate/  # Evaluation form
│   ├── runs/      # Runs listing and details
│   └── ui/        # Reusable UI components
├── hooks/         # Custom React hooks
├── types/         # TypeScript definitions
└── utils/         # Utility functions
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Data Flow

1. User submits evaluation form
2. Frontend sends request to backend API
3. Backend runs evaluation using OmniBAR
4. Results stored in database
5. Frontend displays results and updates dashboard

## Environment

```bash
   VITE_API_URL=http://localhost:8000
```

## Development

The app uses:

- TanStack Query for server state management
- React Router for navigation
- Custom hooks for data fetching
- TypeScript for type safety

Components are organized by feature with clear separation between UI and business logic.

## Features Cut-Off

- User Authentication & Authorization
- Data Export (CSV/PDF) & Reporting
- Batch Evaluation Processing
- Model Management & Comparison

## Tradeoffs

- React over Vue/Angular because of TS support and Tanstack Query integration
- Chose Synchronous over Asynchronous Evaluation (good for immediate feedback but bad for long running tasks)

## Lessons Learned

1. **Scope Creep is Real**: Every feature seemed "simple" but added complexity
2. **Demo-First Thinking**: Focus on what demonstrates the core value proposition
3. **User Journey Matters**: Single evaluation flow was more compelling than batch processing
4. **Technical Debt vs. Features**: Sometimes it's better to do fewer things well
