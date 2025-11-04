const express = require('express');
const router = express.Router();

// Create child
router.post('/children', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json({ ok:false, message:'Not authenticated' });
    const { name, date_of_birth, notes } = req.body;
    if (!name || !date_of_birth) return res.json({ ok:false, message:'Missing required fields' });
    const [result] = await req.pool.query('INSERT INTO children (user_id, name, date_of_birth, notes) VALUES (?, ?, ?, ?)', [userId, name, date_of_birth, notes || null]);
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
    const [rows] = await req.pool.query('SELECT id, name, date_of_birth, notes FROM children WHERE user_id = ?', [userId]);
    res.json({ ok:true, children: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, message:'Server error' });
  }
});

module.exports = router;