import path from 'path';
import fs from 'fs-extra';

export async function writeEnvExample(projectDir: string): Promise<void> {
  const content = `# Copy this file to .env.local and fill in your values
# Never commit .env.local to version control

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=

# Auth
AUTH_SECRET=

# External APIs
# OPENAI_API_KEY=
# STRIPE_SECRET_KEY=
`;

  const envPath = path.join(projectDir, '.env.example');
  const exists = await fs.pathExists(envPath);
  if (!exists) {
    await fs.writeFile(envPath, content);
  }
}
