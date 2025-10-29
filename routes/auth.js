const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.json({ ok:false, message:'Missing fields' });
  try {
    const pool = req.pool;
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.json({ ok:false, message:'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash]);
    req.session.userId = result.insertId;
    res.json({ ok:true, message:'Account created', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, message:'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ ok:false, message:'Missing fields' });
  try {
    const pool = req.pool;
    const [rows] = await pool.query('SELECT id, password_hash, name FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.json({ ok:false, message:'User not found' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.json({ ok:false, message:'Invalid password' });
    req.session.userId = user.id;
    res.json({ ok:true, message:'Logged in', user: { id: user.id, name: user.name }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, message:'Server error' });
  }
});

router.get('/logout', (req,res)=>{
  req.session.destroy(()=> res.json({ ok:true, message:'Logged out' }));
});

// Check current session
router.get('/me', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.json({ ok: false, message: 'Not authenticated' });
  
  try {
    const pool = req.pool;
    const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.json({ ok: false, message: 'User not found' });
    
    res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.json({ ok: false, message: 'Not authenticated' });
  
  const { name, email } = req.body;
  if (!name || !email) return res.json({ ok: false, message: 'Missing fields' });
  
  try {
    const pool = req.pool;
    
    // Check if email is already taken by another user
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingUsers.length > 0) {
      return res.json({ ok: false, message: 'Email address is already in use' });
    }
    
    // Update user profile
    await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
    
    res.json({ ok: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// Change password
router.put('/password', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.json({ ok: false, message: 'Not authenticated' });
  
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.json({ ok: false, message: 'Missing fields' });
  
  try {
    const pool = req.pool;
    
    // Get current user
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.json({ ok: false, message: 'User not found' });
    
    // Verify current password
    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) return res.json({ ok: false, message: 'Current password is incorrect' });
    
    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);
    
    res.json({ ok: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
});

module.exports = router;