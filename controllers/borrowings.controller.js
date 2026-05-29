import prisma from '../database/config.database.js'
import logger from '../configs/logger.config.js'

export const getAllBorrowings = async (req, res) => {
  try {
    // Mengambil semua peminjaman dari database menggunakan Prisma Client
    const borrowings = await prisma.borrowings.findMany({
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    return sendResponse(res, 200, true, 'Borrowings retrieved successfully', borrowings)
  } catch (error) {
    logger.error('Error fetching borrowings:', error)
    sendResponse(res, 500, false, 'Failed to retrieve borrowings')
  }
}

export const getBorrowingById = async (req, res) => {
  try {
    // Mendapatkan ID peminjaman yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    const borrowing = await prisma.borrowings.findUnique({
      where: { id: parseInt(id) },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    // Jika peminjaman tidak ditemukan, kirimkan pesan error
    if (!borrowing) {
      return sendResponse(res, 404, false, `Borrowing with ID: ${id} not found`)
    }

    return sendResponse(res, 200, true, 'Borrowing retrieved successfully', borrowing)
  } catch (error) {
    logger.error('Error fetching borrowing:', error)
    sendResponse(res, 500, false, 'Failed to retrieve borrowing')
  }
}

export const createBorrowing = async (req, res) => {
  try {
    // Mendapatkan data userId dan bookId dari body request
    const { userId, bookId } = req.body

    // Mengecek apakah user dengan ID yang diberikan ada di database menggunakan fungsi isUserExist
    const userExists = await isUserExist(userId)

    if (!userExists) {
      return sendResponse(res, 404, false, `User with ID: ${userId} not found`)
    }

    // Mengecek apakah buku dengan ID yang diberikan ada di database menggunakan fungsi isBookExist
    const bookExists = await isBookExist(bookId)

    if (!bookExists) {
      return sendResponse(res, 404, false, `Book with ID: ${bookId} not found`)
    }

    const borrowing = await prisma.borrowings.create({
      data: {
        userId: parseInt(userId),
        bookId: parseInt(bookId),
      },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    // Update ketersediaan buku menjadi false setelah dipinjam
    await prisma.books.update({
      where: { id: parseInt(bookId) },
      data: { available: false },
    })

    return sendResponse(res, 201, true, 'Borrowing created successfully', borrowing)
  } catch (error) {
    logger.error('Error creating borrowing:', error)
    sendResponse(res, 500, false, 'Failed to create borrowing')
  }
}
export const isUserExist = async (id) => {
  // Mencari pengguna dengan ID yang sesuai di database menggunakan Prisma Client
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  })

  return !!user
}
export const isBookExist = async (id) => {
  // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
  const book = await prisma.books.findUnique({
    where: {
      id: id,
    },
  })

  return !!book
}
export const returnBook = async (req, res) => {
  try {
    // Mendapatkan ID peminjaman yang akan dikembalikan dari parameter URL
    const { id } = req.params

    // Mencari peminjaman dengan ID yang sesuai di database menggunakan Prisma Client
    const borrowing = await prisma.borrowings.findUnique({
      where: { id: parseInt(id) },
    })

    // Jika peminjaman tidak ditemukan, kirimkan pesan error
    if (!borrowing) {
      return sendResponse(res, 404, false, 'Borrowing not found')
    }

    // Cek apakah buku sudah dikembalikan
    if (borrowing.returned_at) {
      return sendResponse(res, 400, false, 'Book already returned')
    }

    // Update peminjaman dengan ID yang sesuai di database menggunakan Prisma Client
    const returnedBorrowing = await prisma.borrowings.update({
      where: { id: parseInt(id) },
      data: { returned_at: new Date() },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    // Update ketersediaan buku menjadi true setelah dikembalikan
    await prisma.books.update({
      where: { id: returnedBorrowing.bookId },
      data: { available: true },
    })

    return sendResponse(res, 200, true, 'Book returned successfully', returnedBorrowing)
  } catch (error) {
    logger.error('Error returning book:', error)
    sendResponse(res, 500, false, 'Failed to return book')
  }
}

export const deleteBorrowing = async (req, res) => {
  try {
    // Mendapatkan ID peminjaman yang akan dihapus dari parameter URL, query, atau body
    const id = parseInt(req.params.id || req.query.id || req.body.id)

    if (!id) {
      return sendResponse(res, 400, false, 'Borrowing ID is required')
    }

    // Mencari peminjaman dengan ID yang sesuai di database menggunakan Prisma Client
    const borrowing = await prisma.borrowings.findUnique({
      where: { id },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        book: true,
      },
    })

    // Jika peminjaman tidak ditemukan, kirimkan pesan error
    if (!borrowing) {
      return sendResponse(res, 404, false, 'Borrowing not found')
    }

    // Hapus peminjaman dengan ID yang sesuai di database menggunakan Prisma Client
    await prisma.borrowings.delete({ where: { id: parseInt(id) } })

    // Update ketersediaan buku menjadi true jika buku belum dikembalikan
    if (!borrowing.returned_at) {
      await prisma.books.update({
        where: { id: borrowing.bookId },
        data: { available: true },
      })
    }

    return sendResponse(res, 200, true, 'Borrowing deleted successfully', borrowing)
  } catch (error) {
    logger.error('Error deleting borrowing:', error)
    sendResponse(res, 500, false, 'Failed to delete borrowing')
  }
}

const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};