import type { ProjectType } from '../types/installer.js';

export interface ProjectTypeChoice {
  name: string;
  value: ProjectType;
  description: string;
}

export const PROJECT_TYPES: ProjectTypeChoice[] = [
  {
    name: 'Website',
    value: 'website',
    description: 'Next.js, React, Vue, Astro, SvelteKit, and more',
  },
  {
    name: 'Mobile App',
    value: 'mobile',
    description: 'Expo, React Native, Flutter, Kotlin',
  },
  {
    name: 'Desktop App',
    value: 'desktop',
    description: 'Tauri, Electron, Neutralino',
  },
  {
    name: 'Backend API',
    value: 'backend',
    description: 'Express, Hono, Fastify, NestJS, Flask, Django',
  },
  {
    name: 'Full Stack App',
    value: 'fullstack',
    description: 'Next.js SaaS, T3, MERN, Nuxt full stack',
  },
  {
    name: 'Game',
    value: 'game',
    description: 'Phaser, Three.js, Kaboom, Godot starter',
  },
  {
    name: 'AI Project',
    value: 'ai',
    description: 'AI chat app, Python API, Computer Vision, LangChain',
  },
  {
    name: 'Quick Setup',
    value: 'quick',
    description: 'Common presets with smart defaults',
  },
];
