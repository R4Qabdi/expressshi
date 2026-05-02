import express from 'express'
import prisma from '../database.js'
const router = express.Router()

import {
  createBorrowings,
  getBorrowingById,
  getBorrowings,
  getAllBorrowingsByUserId,
  updateBorrowing,
  deleteBorrowing,
} from '../controllers/borrowings.controller.js'
import {bookValidation, updateBookValidation} from '../validation/book.validation.js'

router.get('/', getBorrowings)
router.get('/:id', getBorrowingById)
router.get('/user/:userId', getAllBorrowingsByUserId)
router.post('/',borrowingValidation, createBorrowings)
router.put('/:id', updateBorrowingValidation, updateBorrowing)
router.delete('/:id', deleteBorrowing)

export default router