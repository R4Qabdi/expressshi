import express from 'express'
const router = express.Router()

import {
  createBorrowing,
  getAllBorrowings,
  getBorrowingById,
  returnBook,
  deleteBorrowing,
} from '../controllers/borrowings.controller.js'

router.get('/', getAllBorrowings)
router.get('/:id', getBorrowingById)
router.post('/', createBorrowing)
router.put('/:id/return', returnBook)
router.delete('/', deleteBorrowing)

export default router