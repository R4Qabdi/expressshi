import express from 'express'
// import prisma from './configs/database.js' dihapus karena sudah diimport di masing-masing route
import router from './routes/index.route.js'
import pinoHttp from 'pino-http' // jangan lupa import
import logger from './configs/logger.config.js' // jangan lupa import





const app = express()
const port = 3000

app.use(pinoHttp()) // Tambahkan ini
app.use(express.json())
app.use(router)
// Middleware untuk parsing JSON pada request body
app.use(express.json())
app.use(router)

if (process.env.ENV !== 'production') {
  const port = process.env.PORT || 3000

  app.listen(port, () => {
    // Ganti dari console.log menjadai logger.info() 
    logger.info(`Library API is running url: <http://localhost>:${port}`)
  })
}

export default app