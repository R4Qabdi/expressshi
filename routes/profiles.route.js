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


router.get('/', getProfiles)
router.get('/:id', getProfileById)
router.post('/', createProfile)
router.put('/:id', updateProfile)
router.delete('/:id', deleteProfile)

export default router   