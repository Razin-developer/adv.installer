// Converts "My Cool App" or "my cool app" to "my-cool-app"
export function toKebabCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Validates that the name is a legal npm package name (simplified)
export function isValidPackageName(name: string): boolean {
  if (!name || name.length === 0) return false;
  if (name.length > 214) return false;
  if (name.startsWith('.') || name.startsWith('_')) return false;
  if (name !== name.toLowerCase()) return false;
  return /^[a-z0-9][a-z0-9._-]*$/.test(name);
}

export interface NameValidationResult {
  valid: boolean;
  normalized: string;
  warnings: string[];
}

export function validateAndNormalizeName(input: string): NameValidationResult {
  const warnings: string[] = [];
  const normalized = toKebabCase(input);

  if (!normalized) {
    return { valid: false, normalized: '', warnings: ['Name cannot be empty.'] };
  }

  if (input !== normalized) {
    warnings.push(`Name was normalized to: ${normalized}`);
  }

  if (!isValidPackageName(normalized)) {
    warnings.push('Name may not be a valid npm package name. Continuing anyway.');
  }

  return { valid: true, normalized, warnings };
}
