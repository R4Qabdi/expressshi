import express from 'express'
import prisma from '../database.js'
const router = express.Router()

import {
  createUser,
  getUserById,
  getUsers,
  getUserByIdWithProfile,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { authorizeAdmin } from '../middlewares/admin.middleware.js'

router.get('/', getUsers)
router.get('/:id', getUserById)
router.get('/profile/:id', getUserByIdWithProfile)

router.post('/', authenticateToken, authorizeAdmin, createUser)
router.put('/:id', authenticateToken, authorizeAdmin, updateUser)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser)

export default router