import fs from 'node:fs';
import path from 'node:path';

type PackageJson = {
  name: string;
  version: string;
  repository?: string | { url?: string };
};

const rootPackage = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '..', 'package.json'), 'utf8')
) as PackageJson;

function normalizeRepositoryUrl(repository: PackageJson['repository']): string {
  const rawUrl =
    typeof repository === 'string'
      ? repository
      : repository?.url ?? 'https://github.com/Razin-developer/adv.installer';

  return rawUrl.replace(/^git\+/, '').replace(/\.git$/, '');
}

export const packageName = rootPackage.name;
export const packageVersion = rootPackage.version;
export const repoUrl = normalizeRepositoryUrl(rootPackage.repository);
export const repoPath = repoUrl.replace('https://github.com/', '');
export const npmUrl = `https://www.npmjs.com/package/${packageName}`;
