import express from 'express'
import prisma from '../database.js'
import booksRoute from './books.route.js'
import usersRoute from './users.route.js'
import profileRoute from './profiles.route.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the API Library')
})

router.use('/books', booksRoute)
router.use('/users', usersRoute)
router.use('/profiles', profileRoute)

export default router