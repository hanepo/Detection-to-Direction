const express = require('express');
const router = express.Router();

router.get('/therapists', async (req, res) => {
  try {
    const disorder = req.query.disorder;
    const state = req.query.state || '';
    
    if (!disorder) {
      return res.json({ ok: false, message: 'Disorder parameter required' });
    }
    
    // Use JSON_CONTAINS to search in the specializations JSON array
    // Also search by state if provided
    let sql = 'SELECT id, name, specializations, address, city, state, phone, email, website FROM therapists WHERE JSON_CONTAINS(specializations, ?)';
    let params = [JSON.stringify(disorder)];
    
    if (state) {
      sql += ' AND state LIKE ?';
      params.push(`%${state}%`);
    }
    
    sql += ' LIMIT 50';
    
    const [rows] = await req.pool.query(sql, params);
    res.json({ ok: true, therapists: rows });
  } catch (err){
    console.error(err);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
});

module.exports = router;