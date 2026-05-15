import type { QuickPreset } from '../types/installer.js';

export const QUICK_PRESETS: Record<string, QuickPreset> = {
  nextjs: {
    key: 'nextjs',
    projectType: 'website',
    framework: 'nextjs',
    tailwind: true,
    uiLibrary: 'shadcn',
    defaultAddons: ['git', 'readme', 'env-example'],
    description: 'Next.js + Tailwind + shadcn/ui',
  },
  react: {
    key: 'react',
    projectType: 'website',
    framework: 'react-vite',
    tailwind: true,
    uiLibrary: 'none',
    defaultAddons: ['git', 'readme'],
    description: 'React + Vite + Tailwind',
  },
  tauri: {
    key: 'tauri',
    projectType: 'desktop',
    framework: 'tauri-react',
    tailwind: true,
    uiLibrary: 'none',
    defaultAddons: ['git', 'readme'],
    description: 'Tauri + React + Tailwind',
  },
  express: {
    key: 'express',
    projectType: 'backend',
    framework: 'express',
    tailwind: false,
    uiLibrary: 'none',
    defaultAddons: ['git', 'readme', 'env-example', 'prettier'],
    description: 'Express + TypeScript API',
  },
  hono: {
    key: 'hono',
    projectType: 'backend',
    framework: 'hono',
    tailwind: false,
    uiLibrary: 'none',
    defaultAddons: ['git', 'readme', 'env-example'],
    description: 'Hono + TypeScript API',
  },
  expo: {
    key: 'expo',
    projectType: 'mobile',
    framework: 'expo',
    tailwind: false,
    uiLibrary: 'none',
    defaultAddons: ['git', 'readme'],
    description: 'Expo React Native app',
  },
  'ai-chat': {
    key: 'ai-chat',
    projectType: 'ai',
    framework: 'nextjs-ai-chat',
    tailwind: true,
    uiLibrary: 'shadcn',
    defaultAddons: ['git', 'readme', 'env-example'],
    description: 'Next.js AI chat app',
  },
};

export function resolveQuickPreset(key: string): QuickPreset | undefined {
  return QUICK_PRESETS[key.toLowerCase()];
}

export function listQuickPresets(): QuickPreset[] {
  return Object.values(QUICK_PRESETS);
}
