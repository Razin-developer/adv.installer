import type { FrameworkChoice } from '../types/installer.js';

export const WEBSITE_FRAMEWORKS: FrameworkChoice[] = [
  { name: 'Next.js', value: 'nextjs', description: 'React framework with SSR, SSG, and App Router' },
  { name: 'React + Vite', value: 'react-vite', description: 'Fast React + TypeScript setup with Vite' },
  { name: 'Vue + Vite', value: 'vue-vite', description: 'Vue 3 + TypeScript with Vite' },
  { name: 'Nuxt', value: 'nuxt', description: 'Vue framework with SSR and file-based routing' },
  { name: 'Angular', value: 'angular', description: 'Full-featured web framework by Google' },
  { name: 'SvelteKit', value: 'sveltekit', description: 'Svelte with routing, SSR, and adapters' },
  { name: 'Astro', value: 'astro', description: 'Content-first static site builder' },
  { name: 'Remix', value: 'remix', description: 'Full-stack React with nested routing' },
  { name: 'SolidStart', value: 'solidstart', description: 'SolidJS meta-framework' },
];

export const MOBILE_FRAMEWORKS: FrameworkChoice[] = [
  { name: 'Expo React Native', value: 'expo', description: 'Managed React Native with Expo' },
  { name: 'React Native CLI', value: 'react-native-cli', description: 'Bare React Native project' },
  { name: 'Flutter', value: 'flutter', description: 'Google\'s cross-platform UI toolkit' },
  { name: 'Kotlin Android Starter', value: 'kotlin-android', description: 'Basic Android project structure' },
];

export const DESKTOP_FRAMEWORKS: FrameworkChoice[] = [
  { name: 'Tauri + React', value: 'tauri-react', description: 'Rust-powered desktop with React frontend' },
  { name: 'Tauri + Vue', value: 'tauri-vue', description: 'Rust-powered desktop with Vue frontend' },
  { name: 'Tauri + Svelte', value: 'tauri-svelte', description: 'Rust-powered desktop with Svelte frontend' },
  { name: 'Electron + React', value: 'electron-react', description: 'Node-based desktop with React' },
  { name: 'Neutralino', value: 'neutralino', description: 'Lightweight alternative to Electron' },
];

export const BACKEND_FRAMEWORKS: FrameworkChoice[] = [
  { name: 'Express', value: 'express', description: 'Minimal and flexible Node.js web framework' },
  { name: 'Hono', value: 'hono', description: 'Ultrafast web framework for the edge' },
  { name: 'Fastify', value: 'fastify', description: 'Fast and low-overhead Node.js framework' },
  { name: 'NestJS', value: 'nestjs', description: 'Progressive Node.js framework with DI' },
  { name: 'Flask', value: 'flask', description: 'Lightweight Python web framework' },
  { name: 'Django', value: 'django', description: 'Batteries-included Python web framework' },
];

export const FULLSTACK_PRESETS: FrameworkChoice[] = [
  { name: 'Next.js SaaS Starter', value: 'nextjs-saas', description: 'Next.js with auth, DB, and billing wiring' },
  { name: 'Next.js + Express API', value: 'nextjs-express', description: 'Next.js frontend + Express backend' },
  { name: 'T3-style App', value: 't3', description: 'Next.js + tRPC + Prisma + Tailwind' },
  { name: 'MERN Starter', value: 'mern', description: 'MongoDB, Express, React, Node.js' },
  { name: 'Nuxt Full Stack', value: 'nuxt-fullstack', description: 'Nuxt with Nitro server and Drizzle' },
  { name: 'SvelteKit Full Stack', value: 'sveltekit-fullstack', description: 'SvelteKit with server routes and DB' },
];

export const GAME_FRAMEWORKS: FrameworkChoice[] = [
  { name: 'Phaser', value: 'phaser', description: '2D game framework for the browser' },
  { name: 'Three.js', value: 'threejs', description: '3D graphics library for the web' },
  { name: 'Kaboom', value: 'kaboom', description: 'Fun and fast 2D game library' },
  { name: 'Godot Folder Starter', value: 'godot', description: 'Project folder structure for Godot' },
  { name: 'Unity Folder Starter', value: 'unity', description: 'Project folder structure for Unity' },
];

export const AI_PRESETS: FrameworkChoice[] = [
  { name: 'Next.js AI Chat App', value: 'nextjs-ai-chat', description: 'Chat interface with the AI SDK' },
  { name: 'Python Flask AI API', value: 'flask-ai', description: 'Flask REST API with OpenAI integration' },
  { name: 'Computer Vision Starter', value: 'computer-vision', description: 'Python + OpenCV + PyTorch starter' },
  { name: 'Ollama Local AI Starter', value: 'ollama', description: 'Run local models with Ollama' },
  { name: 'LangChain Starter', value: 'langchain', description: 'LangChain + LangGraph application' },
];

export const QUICK_SETUP_OPTIONS: FrameworkChoice[] = [
  { name: 'Next.js + Tailwind + shadcn', value: 'nextjs', description: 'Full Next.js setup, batteries included' },
  { name: 'React + Vite + Tailwind', value: 'react', description: 'Lean React + Vite setup' },
  { name: 'Tauri + React + Tailwind', value: 'tauri', description: 'Desktop app with Tauri' },
  { name: 'Express + TypeScript', value: 'express', description: 'Minimal TypeScript API server' },
  { name: 'Hono API + TypeScript', value: 'hono', description: 'Fast edge-ready API' },
  { name: 'Expo App', value: 'expo', description: 'React Native with Expo' },
  { name: 'AI Chat App', value: 'ai-chat', description: 'Next.js AI chat starter' },
];
