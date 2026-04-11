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

router.get('/', getUsers)
router.get('/:id', getUserById)
router.get('/profile/:id', getUserByIdWithProfile)

router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router