const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const pool = require('./db');
const screeningLogic = require('./screening_logic');

const auth = require('./routes/auth');
const children = require('./routes/children');
const questions = require('./routes/questions');
const screening = require('./routes/screening');
const therapists = require('./routes/therapists');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_key_change',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000*60*60*24 } // 1 day
}));

// Simple middleware to attach pool to req for convenience
app.use((req, res, next)=>{ req.pool = pool; next(); });

// Public static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', auth);
app.use('/api', children);
app.use('/api', questions);
app.use('/api', screening);
app.use('/api', therapists);

// Fallback to index
app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'public','index.html')));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server started on http://localhost:${PORT}`));