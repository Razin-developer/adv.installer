export class AdvInstallerError extends Error {
  constructor(
    message: string,
    public readonly step?: string,
    public readonly command?: string
  ) {
    super(message);
    this.name = 'AdvInstallerError';
  }
}

export function isUserCancel(error: unknown): boolean {
  return error instanceof Error && error.name === 'ExitPromptError';
}

export function isAdvInstallerError(error: unknown): error is AdvInstallerError {
  return error instanceof AdvInstallerError;
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
