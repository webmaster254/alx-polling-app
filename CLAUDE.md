# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.2 polling application bootstrapped with `create-next-app`, using the App Router architecture. The project is built with TypeScript, React 19, and Tailwind CSS 4.

## Common Commands

- `npm run dev` - Start development server (runs on http://localhost:3000)
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture

- **Framework**: Next.js 15.5.2 with App Router
- **Styling**: Tailwind CSS 4 with PostCSS
- **TypeScript**: Strict mode enabled with path mapping (`@/*` -> `./`)
- **Font**: Geist Sans and Geist Mono from Google Fonts

## Project Structure

```
app/
├── layout.tsx      # Root layout with font configuration
├── page.tsx        # Homepage component
└── globals.css     # Global Tailwind styles
```

## Configuration Details

- **ESLint**: Uses Next.js core-web-vitals and TypeScript configs with flat config format
- **TypeScript**: ES2017 target with strict mode and Next.js plugin
- **Path Mapping**: `@/*` resolves to project root
- **Build Output**: `.next/` directory (ignored by ESLint)

## Development Notes

- Main entry point for editing: `app/page.tsx`
- Layout modifications: `app/layout.tsx`
- The project uses Tailwind's utility-first approach with dark mode support
- Image optimization via Next.js `Image` component from `/public` directory