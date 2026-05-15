import { describe, it, expect } from 'vitest';
import { resolveQuickPreset, listQuickPresets, QUICK_PRESETS } from '../src/config/quick-presets';

describe('resolveQuickPreset', () => {
  it('resolves nextjs preset', () => {
    const preset = resolveQuickPreset('nextjs');
    expect(preset).toBeDefined();
    expect(preset?.framework).toBe('nextjs');
    expect(preset?.tailwind).toBe(true);
    expect(preset?.uiLibrary).toBe('shadcn');
  });

  it('resolves react preset', () => {
    const preset = resolveQuickPreset('react');
    expect(preset?.framework).toBe('react-vite');
    expect(preset?.tailwind).toBe(true);
  });

  it('resolves express preset', () => {
    const preset = resolveQuickPreset('express');
    expect(preset?.projectType).toBe('backend');
    expect(preset?.tailwind).toBe(false);
    expect(preset?.uiLibrary).toBe('none');
  });

  it('resolves ai-chat preset', () => {
    const preset = resolveQuickPreset('ai-chat');
    expect(preset?.projectType).toBe('ai');
    expect(preset?.framework).toBe('nextjs-ai-chat');
    expect(preset?.uiLibrary).toBe('shadcn');
  });

  it('is case-insensitive', () => {
    const preset = resolveQuickPreset('NEXTJS');
    expect(preset).toBeDefined();
  });

  it('returns undefined for unknown preset', () => {
    const preset = resolveQuickPreset('non-existent-preset');
    expect(preset).toBeUndefined();
  });
});

describe('listQuickPresets', () => {
  it('returns all presets', () => {
    const list = listQuickPresets();
    expect(list.length).toBe(Object.keys(QUICK_PRESETS).length);
  });

  it('every preset has required fields', () => {
    const list = listQuickPresets();
    for (const preset of list) {
      expect(preset.key).toBeTruthy();
      expect(preset.projectType).toBeTruthy();
      expect(preset.framework).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(Array.isArray(preset.defaultAddons)).toBe(true);
    }
  });
});

describe('quick preset default addons', () => {
  it('nextjs preset includes git and readme', () => {
    const preset = resolveQuickPreset('nextjs');
    expect(preset?.defaultAddons).toContain('git');
    expect(preset?.defaultAddons).toContain('readme');
  });

  it('express preset includes prettier config', () => {
    const preset = resolveQuickPreset('express');
    expect(preset?.defaultAddons).toContain('prettier');
  });
});
