import express from 'express'
// import prisma from './configs/database.js' dihapus karena sudah diimport di masing-masing route
import router from './routes/index.route.js'

const app = express()
const port = 3000

// Middleware untuk parsing JSON pada request body
app.use(express.json())
app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})