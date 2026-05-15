import { describe, it, expect } from 'vitest';
import path from 'path';
import { resolveTargetDir, getParentDir, getProjectName, toDisplayPath } from '../src/utils/paths';

describe('resolveTargetDir', () => {
  it('joins parent dir and project name', () => {
    const result = resolveTargetDir('/home/user/projects', 'my-app');
    expect(result).toBe(path.resolve('/home/user/projects', 'my-app'));
  });

  it('resolves relative parent paths to absolute', () => {
    const result = resolveTargetDir('.', 'my-app');
    expect(path.isAbsolute(result)).toBe(true);
    expect(result.endsWith('my-app')).toBe(true);
  });
});

describe('getParentDir', () => {
  it('returns the directory above the project', () => {
    const target = path.join('/home', 'user', 'projects', 'my-app');
    expect(getParentDir(target)).toBe(path.join('/home', 'user', 'projects'));
  });
});

describe('getProjectName', () => {
  it('returns the last segment of the path', () => {
    const target = path.join('/home', 'user', 'projects', 'my-app');
    expect(getProjectName(target)).toBe('my-app');
  });
});

describe('toDisplayPath', () => {
  it('replaces backslashes with forward slashes', () => {
    expect(toDisplayPath('C:\\Users\\razin\\projects\\app')).toBe('C:/Users/razin/projects/app');
  });

  it('leaves paths with forward slashes unchanged', () => {
    expect(toDisplayPath('/home/user/projects/app')).toBe('/home/user/projects/app');
  });
});
