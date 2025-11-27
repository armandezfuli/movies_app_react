# Movies App React — Senior-level 2025 Showcase

A modern, production-ready movie discovery web app built with React + TypeScript + Vite, showcasing **best-in-class 2025 architecture** and practices.

**Live Demo**: https://movies-app-react-2f3h.vercel.app

![Preview](public/screenshot.png)

## Features

- Search movies (powered by TMDB)
- Trending section based on real user searches (Appwrite backend)
- Popular movies with smart caching
- Debounced search with instant feedback
- Fully responsive & accessible UI
- Zero manual state management for data loading
- Real-time trending counter using Appwrite Cloud

## Tech Stack (2025 Senior Standards)

| Layer              | Technology                                      |
|--------------------|--------------------------------------------------|
| Runtime            | React 19 + TypeScript + Vite                     |
| Data Fetching      | Axios + centralized instance                     |
| State Management   | TanStack Query (React Query) — no useEffect!     |
| Architecture       | Feature-Sliced Design + Shared layer             |
| Custom Hooks       | `useMovies`, `useTrendingMovies`, `useDebouncedValue` |
| Backend (Trending) | Appwrite Cloud (real-time search counting)       |
| Styling            | Tailwind CSS                                     |
| Routing            | React Router v6                                  |
| Deployment         | Vercel                                           |

## Project Evolution — My Refactoring Journey

This project started as a simple Vite + React template and went through **multiple professional refactors**:

1. **Initial Setup** → Basic routing + TMDB fetch
2. **First Refactor** → TypeScript conversion + proper typing
3. **Architecture Overhaul** → Full Feature-Sliced Design
4. **API Migration** → fetch → centralized Axios instance
5. **Service Layer** → Clean separation of concerns
6. **Custom Hooks** → Reusable, testable logic
7. **TanStack Query Migration** → Complete removal of useEffect/useState for data
8. **Final Polish** → Absolute imports (@/), clean commits, production-ready code

> This is not just a movie app — it's a **real-world demonstration of Senior Frontend Engineering in 2025**.

## Project Structure (Senior-level)

```bash
src/
├── api/                  # Centralized axios instance
├── app/                  # Root + routing + QueryClientProvider
├── features/movies/
│   ├── components/       # UI components
│   ├── hooks/            # useMovies, useTrendingMovies
│   └── services/         # API services (getPopularMovies, searchMovies)
├── shared/
│   ├── hooks/            # Reusable hooks (useDebouncedValue)
│   └── types/            # Global TypeScript interfaces
└── main.tsx
```

## Getting Started

```bash
git clone https://github.com/armandezfuli/movies_app_react.git
cd movies_app_react
npm install
```

Create `.env` file:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
```

```bash
npm run dev
```

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
```

## Deployment

Deployed with Vercel:  
https://movies-app-react-2f3h.vercel.app

## Author

**Arman Dezfuli**  
Senior Frontend Engineer | React + TypeScript Specialist

> This project is proudly built as a showcase of clean, scalable, and maintainable React architecture — exactly what companies look for in Senior developers in 2025.

**Star this repo if you learned something!**

Made with passion in Iran
