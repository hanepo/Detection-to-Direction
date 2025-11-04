const express = require('express');
const router = express.Router();

// Return questions for given disorder (ASD, ADHD, Dyslexia)
router.get('/questions', async (req, res) => {
  // Check authentication
  const userId = req.session.userId;
  if (!userId) return res.json({ ok: false, message: 'Not authenticated' });
  
  try {
    const disorder = req.query.disorder;
    
    // If no disorder specified, return all questions
    if (!disorder) {
      const [rows] = await req.pool.query('SELECT id, question_text, disorder FROM questions ORDER BY disorder, id');
      res.json({ ok:true, questions: rows });
    } else {
      // Return questions for specific disorder
      const [rows] = await req.pool.query('SELECT id, question_text, disorder FROM questions WHERE disorder = ?', [disorder]);
      res.json({ ok:true, questions: rows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, message:'Server error' });
  }
});

module.exports = router;