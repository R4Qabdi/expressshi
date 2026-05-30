

import express from 'express'
import prisma from '../database.js'
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage })
const router = express.Router()

import {
  createBook,
  getBookById,
  getBooks,
  getAllBooksByCategoryId,
  updateBook,
  deleteBook,
  searchBooks,
} from '../controllers/books.controller.js'
import {bookValidation, updateBookValidation} from '../validation/book.validation.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { authorizeAdmin } from '../middlewares/admin.middleware.js'

router.get('/', getBooks)
router.get('/search', searchBooks)
router.get('/:id', getBookById)
router.get('/:id/books', getAllBooksByCategoryId)
router.post('/', authenticateToken, authorizeAdmin, upload.single('cover'), bookValidation, createBook)
router.put('/:id', authenticateToken, authorizeAdmin, upload.single('cover'), updateBookValidation, updateBook)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteBook)
export default router