import path from 'path';
import fs from 'fs-extra';
import type { PackageManager, ScaffoldCommand } from '../types/installer.js';

export function buildAiCommand(
  framework: string,
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  switch (framework) {
    case 'nextjs-ai-chat':
      return buildNextjsAiChatCommand(projectName, parentDir, pm);
    case 'flask-ai':
    case 'computer-vision':
    case 'ollama':
    case 'langchain':
      // Python-based or folder-based starters — we write files ourselves
      return {
        cmd: 'echo',
        args: [`AI scaffold: ${framework} for ${projectName}`],
        cwd: parentDir,
        description: `Creating ${framework} project structure`,
      };
    default:
      throw new Error(`Unknown AI preset: ${framework}`);
  }
}

function buildNextjsAiChatCommand(
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  const pmFlag: Record<PackageManager, string> = {
    pnpm: '--use-pnpm', npm: '--use-npm', yarn: '--use-yarn', bun: '--use-bun',
  };
  const base = pm === 'pnpm' ? 'pnpm' : pm === 'yarn' ? 'yarn' : pm === 'bun' ? 'bun' : 'npm';
  const createArg = pm === 'pnpm' ? 'next-app' : 'next-app@latest';

  return {
    cmd: base,
    args: ['create', createArg, projectName, '--typescript', '--tailwind', '--app', pmFlag[pm]],
    cwd: parentDir,
    description: 'Creating Next.js AI chat app',
  };
}

export async function scaffoldAiFiles(
  framework: string,
  projectDir: string,
  projectName: string
): Promise<void> {
  await fs.ensureDir(projectDir);

  switch (framework) {
    case 'flask-ai':
      await scaffoldFlaskAi(projectDir, projectName);
      break;
    case 'computer-vision':
      await scaffoldComputerVision(projectDir, projectName);
      break;
    case 'ollama':
      await scaffoldOllama(projectDir, projectName);
      break;
    case 'langchain':
      await scaffoldLangChain(projectDir, projectName);
      break;
  }
}

async function scaffoldFlaskAi(dir: string, name: string): Promise<void> {
  await fs.writeFile(
    path.join(dir, 'app.py'),
    `from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    # Add your AI logic here
    return jsonify({'reply': f"You said: {data.get('message', '')}"})

if __name__ == '__main__':
    app.run(debug=True)
`
  );
  await fs.writeFile(path.join(dir, 'requirements.txt'), 'flask>=3.0.0\nopenai>=1.0.0\npython-dotenv>=1.0.0\n');
  await fs.writeFile(path.join(dir, '.env.example'), 'OPENAI_API_KEY=\nFLASK_ENV=development\n');
  await fs.writeFile(path.join(dir, '.gitignore'), '__pycache__/\n.env\nvenv/\n*.pyc\n');
}

async function scaffoldComputerVision(dir: string, _name: string): Promise<void> {
  await fs.ensureDir(path.join(dir, 'data'));
  await fs.writeFile(
    path.join(dir, 'main.py'),
    `import cv2
import numpy as np

def main():
    # Load an image
    # img = cv2.imread('data/sample.jpg')
    print('Computer Vision starter — add your logic here.')

if __name__ == '__main__':
    main()
`
  );
  await fs.writeFile(path.join(dir, 'requirements.txt'), 'opencv-python>=4.9.0\nnumpy>=1.26.0\ntorch>=2.0.0\ntorchvision>=0.15.0\n');
}

async function scaffoldOllama(dir: string, _name: string): Promise<void> {
  await fs.writeFile(
    path.join(dir, 'main.py'),
    `import requests

OLLAMA_URL = 'http://localhost:11434/api/generate'
MODEL = 'llama3'

def ask(prompt: str) -> str:
    response = requests.post(OLLAMA_URL, json={
        'model': MODEL,
        'prompt': prompt,
        'stream': False,
    })
    return response.json().get('response', '')

if __name__ == '__main__':
    print(ask('Hello! Who are you?'))
`
  );
  await fs.writeFile(path.join(dir, 'requirements.txt'), 'requests>=2.31.0\n');
  await fs.writeFile(path.join(dir, '.env.example'), 'OLLAMA_MODEL=llama3\n');
}

async function scaffoldLangChain(dir: string, _name: string): Promise<void> {
  await fs.writeFile(
    path.join(dir, 'agent.py'),
    `from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model='gpt-4o-mini')

def run(user_input: str) -> str:
    response = llm.invoke([HumanMessage(content=user_input)])
    return response.content

if __name__ == '__main__':
    print(run('Tell me something interesting.'))
`
  );
  await fs.writeFile(path.join(dir, 'requirements.txt'), 'langchain>=0.2.0\nlangchain-openai>=0.1.0\nlanggraph>=0.1.0\npython-dotenv>=1.0.0\n');
  await fs.writeFile(path.join(dir, '.env.example'), 'OPENAI_API_KEY=\n');
}
