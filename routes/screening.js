const express = require('express');
const router = express.Router();
const screeningLogic = require('../screening_logic');

// Endpoint to submit screening answers
router.post('/screening', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json({ ok:false, message:'Not authenticated' });

    const { child_id, disorder, state, answers } = req.body;
    if (!child_id || !disorder || !answers) return res.json({ ok:false, message:'Missing data' });

    // Save each response
    const conn = req.pool;
    const insertVals = answers.map(a=>[child_id, a.question_id, a.answer_score]);
    if (insertVals.length){
      await conn.query('INSERT INTO responses (child_id, question_id, answer_score) VALUES ?', [insertVals]);
    }

    // Compute total per disorder (we can compute only for specified disorder or overall)
    // For simplicity compute sum of scores for the requested disorder
    const [qRows] = await conn.query(`
      SELECT q.disorder_type, SUM(r.answer_score) AS total
      FROM responses r
      JOIN questions q ON q.id = r.question_id
      WHERE r.child_id = ?
      GROUP BY q.disorder_type
    `, [child_id]);

    const scores = { ASD:0, ADHD:0, Dyslexia:0 };
    qRows.forEach(r=> { scores[r.disorder_type] = r.total; });

    // Evaluate via rule logic
    const { results, meta } = screeningLogic.evaluate(scores);

    // Recommend therapists if results includes the disorder
    // If user provided state, filter by state. We suggest centers for any detected disorder; else suggest none
    let therapists = [];
    if (results.length && state){
      // pick first detected disorder to recommend for; but also search for all detected disorders
      const detected = results.map(rt => {
        // Example string "Possible indicators of ASD"
        const parts = rt.split(' ');
        return parts[parts.length-1]; // ASD / ADHD / Dyslexia
      });
      const placeholders = detected.map(()=>'?').join(',');
      const sql = `SELECT id, name, address, phone, website, state, disorder_type FROM therapist_centers WHERE disorder_type IN (${placeholders}) AND state LIKE ? LIMIT 20`;
      const params = [...detected, `%${state}%`];
      const [trows] = await conn.query(sql, params);
      therapists = trows;
    }

    res.json({ ok:true, results, meta, therapists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, message:'Server error' });
  }
});

module.exports = router;