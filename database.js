import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg' // You might need to install this: npm install pg
import { PrismaClient } from './generated/prisma/client.js'

const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

// Pass the adapter here instead of datasourceUrl
const prisma = new PrismaClient({ adapter })

export default prisma