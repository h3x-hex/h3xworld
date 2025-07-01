import { prisma } from '@/prisma/prisma';
import fs from 'fs';

async function main() {
  const users = await prisma.user.findMany();
  const likes = await prisma.like.findMany();
  const bookings = await prisma.booking.findMany();
  const messages = await prisma.message.findMany();

  const data = { users, likes, bookings, messages };
  fs.writeFileSync('export.json', JSON.stringify(data, null, 2));
}

main().then(() => {
  console.log('Data exported');
}).catch((e) => {
  console.error(e);
});
