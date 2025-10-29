const express = require('express');
const router = express.Router();

router.get('/therapists', async (req, res) => {
  try {
    const disorder = req.query.disorder;
    const state = req.query.state || '';
    const sql = 'SELECT id, name, address, phone, website, state, disorder_type FROM therapist_centers WHERE disorder_type = ? AND state LIKE ? LIMIT 50';
    const [rows] = await req.pool.query(sql, [disorder, `%${state}%`]);
    res.json({ ok:true, therapists: rows });
  } catch (err){
    console.error(err);
    res.status(500).json({ ok:false, message:'Server error' });
  }
});

module.exports = router;