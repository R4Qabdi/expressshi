
import prisma from '../database/config.database.js'

export const register = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: validationErrors.array(),
    })
  }

  // Mendapatkan data pengguna baru dari request body
  const { name, email, password } = req.body

  // Mengecek apakah email sudah digunakan oleh pengguna lain di database menggunakan Prisma Client
  const count = await prisma.users.count({ where: { email } })

  if (count > 0) {
    return res.status(409).json({
      success: false,
      error: 'Email already in use',
    })
  }

  // Meng-hash password menggunakan bcryptjs dengan jumlah salt rounds yang diambil dari environment variable
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.BCRYPT_SALT_ROUNDS),
  )

  // Menambahkan pengguna baru ke database menggunakan Prisma Client
  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  res.status(201).json({
    message: 'Registration successful',
    user,
  })
}