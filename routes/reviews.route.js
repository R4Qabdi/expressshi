import express from 'express'
import { getReviewsByBookId, createReview } from '../controllers/reviews.controller.js'

const router = express.Router()

router.get('/book/:id', getReviewsByBookId)
router.post('/', createReview)

export default router