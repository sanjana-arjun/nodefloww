const express = require('express')
const db = require('../db/database')
const router = express.Router()

// Add a new transaction
router.post('/', (req, res) => {
  const {type, category, amount, date, description} = req.body
  const sql = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`
  db.run(sql, [type, category, amount, date, description], function (err) {
    if (err) {
      return res.status(400).json({error: err.message})
    }
    res.status(201).json({id: this.lastID})
  })
})

// Retrieve all transactions
router.get('/', (req, res) => {
  db.all(`SELECT * FROM transactions`, [], (err, rows) => {
    if (err) {
      return res.status(400).json({error: err.message})
    }
    res.json(rows)
  })
})

// Retrieve a transaction by ID
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM transactions WHERE id = ?`
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(400).json({error: err.message})
    }
    if (!row) {
      return res.status(404).json({error: 'Transaction not found'})
    }
    res.json(row)
  })
})

// Update a transaction by ID
router.put('/:id', (req, res) => {
  const {type, category, amount, date, description} = req.body
  const sql = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`
  db.run(
    sql,
    [type, category, amount, date, description, req.params.id],
    function (err) {
      if (err) {
        return res.status(400).json({error: err.message})
      }
      if (this.changes === 0) {
        return res.status(404).json({error: 'Transaction not found'})
      }
      res.json({message: 'Transaction updated successfully'})
    },
  )
})

// Delete a transaction by ID
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM transactions WHERE id = ?`
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      return res.status(400).json({error: err.message})
    }
    if (this.changes === 0) {
      return res.status(404).json({error: 'Transaction not found'})
    }
    res.json({message: 'Transaction deleted successfully'})
  })
})

// Retrieve summary
router.get('/summary', (req, res) => {
  const sql = `SELECT type, SUM(amount) as total FROM transactions GROUP BY type`
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({error: err.message})
    }
    res.json(rows)
  })
})

module.exports = router
