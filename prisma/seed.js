import prisma from '../database/config.database.js';

async function main() {
  console.log('🔄 Membersihkan database...');

  // 1. Hapus data dengan urutan yang benar (tabel anak dulu)
  await prisma.borrowings.deleteMany();
  await prisma.profiles.deleteMany();
  await prisma.books.deleteMany();
  await prisma.users.deleteMany();
  await prisma.categories.deleteMany();

  console.log('✅ Database bersih. Mulai menyuntikkan data baru...');

  // 2. Seed Categories (20 data)
  const categoriesData = [
    { name: 'Fiksi' }, { name: 'Sains & Teknologi' }, { name: 'Sejarah' }, 
    { name: 'Biografi' }, { name: 'Filsafat' }, { name: 'Psikologi' }, 
    { name: 'Komik & Manga' }, { name: 'Bisnis & Ekonomi' }, { name: 'Kesehatan' }, 
    { name: 'Seni & Fotografi' }, { name: 'Sastra Klasik' }, { name: 'Puisi' }, 
    { name: 'Agama & Spiritualitas' }, { name: 'Pengembangan Diri' }, { name: 'Politik' }, 
    { name: 'Hukum' }, { name: 'Bahasa & Linguistik' }, { name: 'Edukasi & Jurnal' }, 
    { name: 'Komputer & Coding' }, { name: 'Petualangan' }
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.categories.create({ data: cat });
    categories.push(createdCat);
  }
  console.log(`📌 Berhasil membuat ${categories.length} kategori.`);

  // 3. Seed Users & Profiles secara bersamaan (20 data)
  const users = [];
  const roles = ['USER', 'USER', 'USER', 'ADMIN']; // Variasi role, dominan USER

  for (let i = 1; i <= 20; i++) {
    const user = await prisma.users.create({
      data: {
        name: `User Ke-${i}`,
        email: `user${i}@example.com`,
        password: `$2b$10$xyzPasswordHashedDenganBenarKe${i}`, // Simulasi bcrypt hash
        role: roles[i % roles.length],
        profiles: {
          create: {
            address: `Jl. Salemba No. ${i}, Jakarta`,
            phone: `0812345678${i.toString().padStart(2, '0')}`
          }
        }
      }
    });
    users.push(user);
  }
  console.log(`📌 Berhasil membuat ${users.length} user beserta profilnya.`);

  // 4. Seed Books (25 data)
  const books = [];
  for (let i = 1; i <= 25; i++) {
    // Ambil id kategori secara acak dari data yang baru dibuat
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const book = await prisma.books.create({
      data: {
        title: `Buku Panduan Volume ${i}`,
        author: `Penulis Budiman ${String.fromCharCode(64 + (i % 5) + 1)}`,
        year: 2000 + i,
        available: i % 5 !== 0, // Sisipkan beberapa buku yang sedang tidak tersedia
        categoryId: randomCategory.id
      }
    });
    books.push(book);
  }
  console.log(`📌 Berhasil membuat ${books.length} buku.`);

  // 5. Seed Borrowings / Riwayat Peminjaman (20 data)
  let borrowCount = 0;
  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomBook = books[Math.floor(Math.random() * books.length)];

    // Buat variasi tanggal: ada yang sudah dikembalikan, ada yang belum
    const isReturned = i % 2 === 0; 
    const borrowDate = new Date();
    borrowDate.setDate(borrowDate.getDate() - (i + 5)); // Peminjaman beberapa hari lalu

    await prisma.borrowings.create({
      data: {
        userId: randomUser.id,
        bookId: randomBook.id,
        borrow_date: borrowDate,
        returned_at: isReturned ? new Date() : null
      }
    });
    borrowCount++;
  }
  console.log(`📌 Berhasil membuat ${borrowCount} riwayat peminjaman.`);
  console.log('🎉 Proses Seeding Selesai Sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });