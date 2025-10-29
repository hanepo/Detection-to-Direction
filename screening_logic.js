// Encapsulates rule-based scoring logic.
// Answers are scored 0..4 per question.
// The function receives an object counts per disorder, returns results array and used thresholds.

const THRESHOLDS = {
  ASD: 18,      // example threshold (tweakable)
  ADHD: 16,
  Dyslexia: 14
};

function evaluate(scores) {
  // scores: { ASD: number, ADHD: number, Dyslexia: number }
  const results = [];
  const meta = { thresholds: THRESHOLDS, scores };
  Object.keys(THRESHOLDS).forEach(disorder=>{
    const val = scores[disorder] || 0;
    if (val >= THRESHOLDS[disorder]) {
      results.push(`Possible indicators of ${disorder}`);
    }
  });
  return { results, meta };
}

module.exports = { evaluate, THRESHOLDS };