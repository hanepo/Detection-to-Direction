const express = require('express');
const router = express.Router();

// Create child
router.post('/children', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json({ ok:false, message:'Not authenticated' });
    const { name, age, notes } = req.body;
    const [result] = await req.pool.query('INSERT INTO children (user_id, name, age, notes) VALUES (?, ?, ?, ?)', [userId, name, age, notes || null]);
    res.json({ ok:true, message:'Child added', childId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, message:'Server error' });
  }
});

// List children for current user
router.get('/children', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json({ ok:false, message:'Not authenticated' });
    const [rows] = await req.pool.query('SELECT id, name, age, notes FROM children WHERE user_id = ?', [userId]);
    res.json({ ok:true, children: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, message:'Server error' });
  }
});

module.exports = router;