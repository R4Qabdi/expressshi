import express from 'express'
const router = express.Router()

import {
  createBorrowing,
  getAllBorrowings,
  getBorrowingById,
  returnBook,
  deleteBorrowing,
} from '../controllers/borrowings.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { authorizeAdmin } from '../middlewares/admin.middleware.js'

router.get('/', getAllBorrowings)
router.get('/:id', getBorrowingById)
router.post('/', authenticateToken, authorizeAdmin, createBorrowing)
router.put('/:id/return', authenticateToken, authorizeAdmin, returnBook)
router.delete('/', authenticateToken, authorizeAdmin, deleteBorrowing)

export default router