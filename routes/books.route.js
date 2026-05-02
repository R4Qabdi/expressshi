import express from 'express'
import prisma from '../database.js'
const router = express.Router()

import {
  createBook,
  getBookById,
  getBooks,
  getAllBooksByCategoryId,
  updateBook,
  deleteBook,
} from '../controllers/books.controller.js'
import {bookValidation, updateBookValidation} from '../validation/book.validation.js'

router.get('/', getBooks)
router.get('/:id', getBookById)
router.get('/:id/books', getAllBooksByCategoryId)
router.post('/',bookValidation, createBook)
router.put('/:id', updateBookValidation, updateBook)
router.delete('/:id', deleteBook)

export default router