// profiles.route.js

import express from 'express'
import prisma from '../database.js'
const router = express.Router()
import {
  createProfile,
  getProfileById,
  getProfiles,
  updateProfile,
  deleteProfile
} from '../controllers/profiles.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { authorizeAdmin } from '../middlewares/admin.middleware.js'


router.get('/', getProfiles)
router.get('/:id', getProfileById)
router.post('/', authenticateToken, authorizeAdmin, createProfile)
router.put('/:id', authenticateToken, authorizeAdmin, updateProfile)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProfile)

export default router   