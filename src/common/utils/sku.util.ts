import { randomBytes } from 'crypto';

export function generateSku(brand: string, name: string): string {
  const brandPart = brand.slice(0, 3).toUpperCase();
  const namePart = name.slice(0, 3).toUpperCase();
  const unique = randomBytes(4).toString('hex').slice(0, 6).toUpperCase();

  return `${brandPart}-${namePart}-${unique}`;
}
