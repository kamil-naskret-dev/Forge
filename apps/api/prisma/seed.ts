import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

const TEMPLATES = [
  {
    name: 'JavaScript',
    language: 'javascript',
    content: `// JavaScript starter\nconsole.log('Hello, Forge!');\n`,
  },
  {
    name: 'TypeScript',
    language: 'typescript',
    content: `// TypeScript starter\nconst greeting: string = 'Hello, Forge!';\nconsole.log(greeting);\n`,
  },
  {
    name: 'Python',
    language: 'python',
    content: `# Python starter\nprint('Hello, Forge!')\n`,
  },
  {
    name: 'Go',
    language: 'go',
    content: `// Go starter\npackage main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, Forge!")\n}\n`,
  },
  {
    name: 'Rust',
    language: 'rust',
    content: `// Rust starter\nfn main() {\n    println!("Hello, Forge!");\n}\n`,
  },
  {
    name: 'HTML/CSS',
    language: 'html',
    content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>Forge</title>\n</head>\n<body>\n  <h1>Hello, Forge!</h1>\n</body>\n</html>\n`,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo room for each template
  for (const template of TEMPLATES) {
    const existing = await prisma.room.findFirst({
      where: { name: `[Template] ${template.name}` },
    });

    if (existing) continue;

    await prisma.room.create({
      data: {
        name: `[Template] ${template.name}`,
        description: `Starter template for ${template.name}`,
        language: template.language,
        visibility: 'PUBLIC',
        // placeholder ownerId — will be replaced with real user in production
        ownerId: 'seed-placeholder',
        files: {
          create: {
            name: `main.${getExtension(template.language)}`,
            type: 'FILE',
            language: template.language,
            content: Buffer.from(template.content),
          },
        },
      },
    });

    console.log(`  ✓ Template: ${template.name}`);
  }

  console.log('✅ Seed complete.');
}

function getExtension(language: string): string {
  const map: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    go: 'go',
    rust: 'rs',
    html: 'html',
  };
  return map[language] ?? 'txt';
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
