import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { utils, write } from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

async function exportUsers() {
  console.log('🔌 Connecting to database...');

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id:        true,
      name:      true,
      email:     true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (users.length === 0) {
    console.log('⚠️  No users found in the database.');
    await prisma.$disconnect();
    return;
  }

  console.log(`✅ Found ${users.length} user(s). Building spreadsheet...`);

  // Map to plain rows with friendly column headers
  const rows = users.map((u, i) => ({
    '#':         i + 1,
    'ID':        u.id,
    'Name':      u.name,
    'Email':     u.email,
    'Created At': u.createdAt.toISOString(),
    'Updated At': u.updatedAt.toISOString(),
  }));

  // Build workbook
  const workbook  = utils.book_new();
  const worksheet = utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 4  },  // #
    { wch: 38 },  // ID
    { wch: 20 },  // Name
    { wch: 30 },  // Email
    { wch: 26 },  // Created At
    { wch: 26 },  // Updated At
  ];

  utils.book_append_sheet(workbook, worksheet, 'Users');

  // Write file
  const outPath = join(__dirname, '..', 'users.xlsx');
  const buffer  = write(workbook, { type: 'buffer', bookType: 'xlsx' });
  writeFileSync(outPath, buffer);

  console.log(`📄 Exported to: ${outPath}`);
  await prisma.$disconnect();
}

exportUsers().catch((err) => {
  console.error('❌ Export failed:', err.message);
  prisma.$disconnect();
  process.exit(1);
});
