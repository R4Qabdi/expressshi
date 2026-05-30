
// import { isCategoryExist } from './categories.controllers.js'
import { getFileUrl, uploadFile, deleteFile} from './cloudinary.controller.js'
import prisma from '../database/config.database.js'
import logger from '../configs/logger.config.js'

export const getBooks = async (req, res) => {
  try {
    // Mengambil semua buku dari database menggunakan Prisma Client
    const books = await prisma.books.findMany()

    // Tambahkan ini
    // add coverUrl to each book
    books.forEach((book) => {
      if (!book.cloudinaryId) {
        book.coverUrl = null
      } else {
        book.coverUrl = getFileUrl(book.cloudinaryId)
      }
    })

    sendResponse(res, 200, true, 'Books retrieved successfully', books);
  } catch (error) {
    logger.error('Error fetching books:', error)
    sendResponse(res, 500, false, 'Failed to retrieve books')
  }
}

export const getBookById = async (req, res) => {
  try {
    // Mendapatkan ID buku yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mengambil buku dengan ID yang sesuai dari database menggunakan Prisma Client
    const book = await prisma.books.findUnique({
      where: {
        id: id
      }
    })

    // Jika buku tidak ditemukan, kirimkan pesan error
    if (!book) {
      // res.send(`Book with ID: ${id} not found`)
      return sendResponse(res, 404, false, `Book with ID: ${id} not found`);

    }
    if (book.cloudinaryId) {
      book.coverUrl = getFileUrl(book.cloudinaryId)
    } else {
      book.coverUrl = null
    }

    // res.send(book)
    sendResponse(res, 200, true, "Book retrieved successfully", book);
  } catch (error) {
    logger.error('Error fetching book:', error)
    sendResponse(res, 500, false, 'Failed to retrieve book')
  }

}
export const getAllBooksByCategoryId = async (req, res) => {
  try {
    // Mendapatkan ID kategori yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mengambil kategori dengan ID yang sesuai dari database menggunakan Prisma Client
    // Beserta dengan data buku-bukunya menggunakan include
    const category = await prisma.categories.findUnique({
      where: {
        id: id,
      },
      // TAMBAHKAN INI
      include: {
        books: true,
      },
    })

    if (!category) {
      return sendResponse(res, 404, false, `Category with ID: ${id} not found`)
    }

    return sendResponse(res, 200, true, 'Books retrieved successfully', category.books)
  } catch (error) {
    logger.error('Error fetching books by category:', error)
    sendResponse(res, 500, false, 'Failed to retrieve books')
  }
}

export const createBook = async (req, res) => {
  try {
    // Mendapatkan data buku baru dari request body
    const { categoryId, title, author, year } = req.body

    // Mengecek apakah kategori dengan ID yang diberikan ada di database menggunakan fungsi isCategoryExist
    const categoryExists = await prisma.categories.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!categoryExists) {
      return sendResponse(res, 404, false, `Category with ID: ${categoryId} not found`)
    }

    const cover = req.file
    let cloudinaryId = null

    if (cover) {
      const result = await uploadFile(cover)

      cloudinaryId = result.public_id
    }
    // Menambahkan buku baru ke database menggunakan Prisma Client
    const book = await prisma.books.create({
      data: {
        categoryId,
        title,
        author,
        year,
        cloudinaryId,
      },
    })

    sendResponse(res, 201, true, "Book created successfully", book);
  } catch (error) {
    logger.error('Error creating book:', error)
    sendResponse(res, 500, false, 'Failed to create book')
  }
}

export const updateBook = async (req, res) => {
  try {
    // Mendapatkan ID buku yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mendapatkan data buku yang akan diupdate dari request body
    const { categoryId, title, author, year } = req.body

    // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
    const book = await prisma.books.findUnique({
      where: {
        id: id,
      },
    })

    // Jika buku tidak ditemukan, kirimkan pesan error
    if (!book) {
      return sendResponse(res, 404, false, `Book with ID: ${id} not found`)
    }

    // Mengecek apakah kategori dengan ID yang diberikan ada di database menggunakan fungsi isCategoryExist
    const categoryExists = await prisma.categories.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!categoryExists) {
      return sendResponse(res, 404, false, `Category with ID: ${categoryId} not found`)
    }

    const cover = req.file
    let cloudinaryId = book.cloudinaryId

    if (cover) {
      // Jika buku sudah memiliki cover sebelumnya,
      // hapus file cover lama dari Cloudinary menggunakan public_id yang disimpan di database
      if (book.cloudinaryId) {
        const deleted = await deleteFile(book.cloudinaryId)
      }

      const result = await uploadFile(cover)
      cloudinaryId = result.public_id
    }
    // Mengupdate buku dengan ID yang sesuai di database menggunakan Prisma Client
    await prisma.books.update({
      where: {
        id: id,
      },
      data: {
        categoryId,
        title,
        author,
        year,
        cloudinaryId,
      },
    })

    // res.send(`Book with ID: ${id} updated successfully`)
    sendResponse(res, 200, true, "Book updated successfully", null);
  } catch (error) {
    logger.error('Error updating book:', error)
    sendResponse(res, 500, false, 'Failed to update book')
  }
}

export const deleteBook = async (req, res) => {
  try {
    // Mendapatkan ID buku yang akan diupdate dari parameter URL
    // Lalu mengubahnya menjadi tipe data integer menggunakan parseInt
    const id = parseInt(req.params.id)

    // Mencari buku dengan ID yang sesuai di database menggunakan Prisma Client
    const book = await prisma.books.findUnique({
      where: {
        id: id
      }
    })

    // Jika buku tidak ditemukan, kirimkan pesan error
    if (!book) {
      return sendResponse(res, 404, false, `Book with ID: ${id} not found`)
    }

    if (book.cloudinaryId) {
      const deleted = await deleteFile(book.cloudinaryId)
    }

    // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
    await prisma.books.delete({
      where: {
        id: id
      }
    })

    return sendResponse(res, 200, true, "Book deleted successfully", null)
  } catch (error) {
    logger.error('Error deleting book:', error)
    sendResponse(res, 500, false, 'Failed to delete book')
  }
}


const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

export const searchBooks = async (req, res) => {
  try {
    const query = req.query.query?.trim()

    if (!query) {
      return sendResponse(res, 400, false, 'Search query is required')
    }

    const page = parseInt(req.query.page) || 1
    const limit = 20
    const skip = (page - 1) * limit

    const books = await prisma.books.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
          { isbn: { contains: query, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        cloudinaryId: true,
      },
      skip,
      take: limit,
    })

    // add coverUrl
    books.forEach((book) => {
      book.coverUrl = book.cloudinaryId ? getFileUrl(book.cloudinaryId) : null
    })

    const total = await prisma.books.count({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
          { isbn: { contains: query, mode: 'insensitive' } },
        ]
      }
    })

    sendResponse(res, 200, true, 'Books retrieved successfully', {
      books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('Error searching books:', error)
    sendResponse(res, 500, false, 'Failed to search books')
  }
}