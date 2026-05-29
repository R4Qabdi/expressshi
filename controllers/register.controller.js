import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import prisma from '../database/config.database.js'
import logger from '../configs/logger.config.js'

export const register = async (req, res) => {
  try {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      return sendResponse(res, 400, false, 'Validation errors', validationErrors.array())
    }

    // Mendapatkan data pengguna baru dari request body
    const { name, email, password } = req.body

    // Mengecek apakah email sudah digunakan oleh pengguna lain di database menggunakan Prisma Client
    const count = await prisma.users.count({ where: { email } })

    if (count > 0) {
      return sendResponse(res, 409, false, 'Email already in use')
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

    return sendResponse(res, 201, true, 'Registration successful', user)
  } catch (error) {
    logger.error('Error during registration:', error)
    sendResponse(res, 500, false, 'Registration failed')
  }
}
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};