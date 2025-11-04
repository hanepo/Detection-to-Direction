const express = require('express');
const router = express.Router();
const screeningLogic = require('../screening_logic');

// Endpoint to submit screening answers
router.post('/screening', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json({ ok: false, message: 'Not authenticated' });

    const { child_id, answers, state } = req.body;
    if (!child_id || !answers || !Array.isArray(answers)) {
      return res.json({ ok: false, message: 'Missing data' });
    }

    const conn = req.pool;
    
    // Calculate total scores per disorder from answers
    const scores = {
      ASD: 0,
      ADHD: 0,
      Dyslexia: 0
    };
    
    answers.forEach(ans => {
      if (scores[ans.disorder] !== undefined) {
        scores[ans.disorder] += ans.score;
      }
    });
    
    // Save screening record
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [screeningResult] = await conn.query(
      'INSERT INTO screenings (child_id, screening_date, asd_score, adhd_score, dyslexia_score) VALUES (?, ?, ?, ?, ?)',
      [child_id, timestamp, scores.ASD, scores.ADHD, scores.Dyslexia]
    );
    
    const screeningId = screeningResult.insertId;
    
    // Save individual answers
    if (answers.length > 0) {
      const insertValues = answers.map(a => [
        screeningId,
        a.question_id,
        a.score
      ]);
      await conn.query(
        'INSERT INTO screening_answers (screening_id, question_id, answer_score) VALUES ?',
        [insertValues]
      );
    }
    
    res.json({ 
      ok: true, 
      message: 'Screening saved successfully',
      scores: scores,
      screening_id: screeningId
    });
    
  } catch (err) {
    console.error('Screening error:', err);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
});

module.exports = router;module.exports = router;