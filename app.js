const express = require('express')
const bodyParser = require('body-parser')
const transactionRoutes = require('./routes/transactions')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use('/transactions', transactionRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
