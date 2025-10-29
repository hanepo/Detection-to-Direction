# Quick Start - 3 Minutes Setup

## What You Need to Do:

### 1️⃣ Start MySQL
- Open XAMPP Control Panel
- Click "Start" on MySQL module

### 2️⃣ Import Database (ONE FILE!)
Go to: http://localhost/phpmyadmin

**Click "SQL" tab**  
**Copy ALL content from `sql/COMPLETE_SETUP.sql`**  
**Paste → Click "Go"**

✅ That's it! One file does everything:
- Creates database
- Creates 6 tables
- Adds 70 questions
- Adds 12 therapist centers

### 3️⃣ Start Server
Open PowerShell in project folder:
```powershell
npm start
```

### 4️⃣ Open Browser
Go to: http://localhost:3000

---

## That's It! 🎉

You should now have:
- ✅ Database: `detection_to_direction`
- ✅ 6 tables (users, children, questions, therapists, screenings, screening_answers)
- ✅ 70 screening questions (20 ASD + 25 ADHD + 25 Dyslexia)
- ✅ 12 therapist centers
- ✅ Working application

---

## Alternative: Step-by-Step (3 separate files)

If you prefer to import in steps:

1. Import `sql/schema.sql` (creates tables)
2. Import `sql/seed_questions.sql` (adds questions)
3. Import `sql/seed_therapists.sql` (adds therapists)

---

## About Those JSON Files:

**Q: Do I need to do anything with `questions.json`, `therapists.json`, or `en.json`?**

**A: NO!** Those are just reference files. The real data comes from MySQL.

- `public/data/questions.json` - Just a reference copy
- `public/data/therapists.json` - Just a reference copy  
- `public/i18n/en.json` - For future multi-language support (not used yet)

The `COMPLETE_SETUP.sql` file already contains all that data and imports it into MySQL.

---

## Troubleshooting:

**Problem**: Error #1054 "Unknown column"
**Solution**: Use `COMPLETE_SETUP.sql` instead - it drops and recreates everything fresh

**Problem**: Children don't appear in dropdown
**Solution**: 
1. Log in first
2. Go to "Children" page
3. Add a child
4. Refresh screening page

**Problem**: Can't connect to database
**Solution**: 
1. Check MySQL is running in XAMPP
2. Check password in `db.js` (default is empty)

**Problem**: Already have old tables?
**Solution**: `COMPLETE_SETUP.sql` automatically drops old tables and creates fresh ones
