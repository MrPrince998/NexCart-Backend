import { Repository } from 'typeorm';
import slugify from 'slugify';
import { randomBytes } from 'crypto';

const randomSuffix = () => randomBytes(4).toString('hex').slice(0, 6);

export async function generateSlug<T extends { slug: string }>(
  name: string,
  repo: Repository<T>,
): Promise<string> {
  const base = slugify(name, { lower: true, strict: true });
  const existing = await repo.findOne({ where: { slug: base } as any });

  return existing ? `${base}-${randomSuffix()}` : base;
}
