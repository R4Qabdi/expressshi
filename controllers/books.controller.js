
// import { isCategoryExist } from './categories.controllers.js'
import prisma from '../database/config.database.js'

export const getBooks = async (req, res) => {
  const books = await prisma.books.findMany()
  sendResponse(res, 200, true, "Books retrieved successfully", books);
}

export const getBookById = async (req, res) => {
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

  // res.send(book)
  sendResponse(res, 200, true, "Book retrieved successfully", book);

}
export const getAllBooksByCategoryId = async (req, res) => {
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
    return res.json({
      success: false,
      message: `Category with ID: ${id} not found`,
    })
  }

  res.json({
    success: true,
    message: 'Books retrieved successfully',
    data: category.books,
  })
}

export const createBook = async (req, res) => {
  // Mendapatkan data buku baru dari request body
  const { categoryId, title, author, year } = req.body

  // Mengecek apakah kategori dengan ID yang diberikan ada di database menggunakan fungsi isCategoryExist
  const categoryExists = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  })

  if (!categoryExists) {
    return res.json({
      success: false,
      message: `Category with ID: ${categoryId} not found`,
    })
  }

  // Menambahkan buku baru ke database menggunakan Prisma Client
  const book = await prisma.books.create({
    data: {
      categoryId,
      title,
      author,
      year,
    },
  })

  sendResponse(res, 201, true, "Book created successfully", book);

}


export const updateBook = async (req, res) => {
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
    return res.json({
      success: false,
      message: `Book with ID: ${id} not found`,
    })
  }

  // Mengecek apakah kategori dengan ID yang diberikan ada di database menggunakan fungsi isCategoryExist
  const categoryExists = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  })

  if (!categoryExists) {
    return res.json({
      success: false,
      message: `Category with ID: ${categoryId} not found`,
    })
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
    },
  })

  // res.send(`Book with ID: ${id} updated successfully`)
  sendResponse(res, 200, true, "Book updated successfully", null);

}

export const deleteBook = async (req, res) => {

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
    // res.send(`Book with ID: ${id} not found`)
    return sendResponse(res, 404, false, `Book with ID: ${id} not found`);
  }

  // Menghapus buku dengan ID yang sesuai di database menggunakan Prisma Client
  await prisma.books.delete({
    where: {
      id: id
    }
  })

  // res.send(`Book with ID: ${id} deleted successfully`)
  sendResponse(res, 200, true, "Book deleted successfully", null);

}


const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};