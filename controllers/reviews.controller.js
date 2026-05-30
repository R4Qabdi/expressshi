import prisma from '../database/config.database.js'
import logger from '../configs/logger.config.js'

export const getReviewsByBookId = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id)

    const book = await prisma.books.findUnique({ where: { id: bookId } })
    if (!book) {
      return sendResponse(res, 404, false, `Book with ID: ${bookId} not found`)
    }

    const reviews = await prisma.reviews.findMany({
      where: { bookId },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    })

    sendResponse(res, 200, true, 'Reviews retrieved successfully', reviews)
  } catch (error) {
    logger.error('Error fetching reviews:', error)
    sendResponse(res, 500, false, 'Failed to retrieve reviews')
  }
}

export const createReview = async (req, res) => {
  try {
    const userId = req.user.id
    const { bookId, rating, comment } = req.body

    const book = await prisma.books.findUnique({ where: { id: bookId } })
    if (!book) {
      return sendResponse(res, 404, false, `Book with ID: ${bookId} not found`)
    }

    // check if user already reviewed this book
    const existing = await prisma.reviews.findFirst({
      where: { userId, bookId }
    })
    if (existing) {
      return sendResponse(res, 400, false, 'You have already reviewed this book')
    }

    const review = await prisma.reviews.create({
      data: { userId, bookId, rating, comment }
    })

    sendResponse(res, 201, true, 'Review created successfully', review)
  } catch (error) {
    logger.error('Error creating review:', error)
    sendResponse(res, 500, false, 'Failed to create review')
  }
}

const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({ success, message, data })
}