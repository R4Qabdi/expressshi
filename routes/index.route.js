import express from 'express'
import prisma from '../database.js'
import booksRoute from './books.route.js'
import usersRoute from './users.route.js'
import profileRoute from './profiles.route.js'
import borrowingRoute from './borrowings.route.js'
import authRoute from './auth.route.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the API Library')
})

router.use('/auth', authRoute)
router.use('/books', authenticateToken, booksRoute)
router.use('/users', authenticateToken, usersRoute)
router.use('/profiles', authenticateToken, profileRoute)
router.use('/auth', authRoute)
router.use('/borrowings', authenticateToken, borrowingRoute)

export default router