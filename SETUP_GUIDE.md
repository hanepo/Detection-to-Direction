# 🚀 Detection to Direction - Complete Setup Guide

## Prerequisites
- ✅ XAMPP installed (for MySQL)
- ✅ Node.js installed
- ✅ npm packages installed (`npm install` already done)

---

## 📝 Step-by-Step Setup Instructions

### **Step 1: Start XAMPP MySQL**

1. Open **XAMPP Control Panel**
2. Click **Start** on the MySQL module
3. (Optional) Start Apache if you want to use phpMyAdmin

---

### **Step 2: Create Database and Import Schema**

#### **Option A: Using phpMyAdmin (Easier)**

1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click on "**SQL**" tab at the top
3. Copy and paste the contents of `sql/schema.sql` into the SQL box
4. Click "**Go**" to execute
5. Repeat for `sql/seed_questions.sql` (to add questions)
6. Repeat for `sql/seed_therapists.sql` (to add therapist centers)

#### **Option B: Using MySQL Command Line**

Open PowerShell or Command Prompt in your project directory and run:

```powershell
# Navigate to XAMPP MySQL bin directory (adjust path if needed)
cd C:\xampp\mysql\bin

# Login to MySQL (press Enter when asked for password if you don't have one)
.\mysql.exe -u root -p

# Then run these commands one by one:
source C:\xampp\htdocs\Detection-to-Direction\sql\schema.sql
source C:\xampp\htdocs\Detection-to-Direction\sql\seed_questions.sql
source C:\xampp\htdocs\Detection-to-Direction\sql\seed_therapists.sql

# Exit MySQL
exit
```

---

### **Step 3: Verify Database Setup**

In phpMyAdmin or MySQL command line, check:

```sql
USE detection_to_direction;

-- Should show 6 tables
SHOW TABLES;

-- Should show 70 questions (20 ASD + 25 ADHD + 25 Dyslexia)
SELECT COUNT(*) FROM questions;

-- Should show 12 therapist centers
SELECT COUNT(*) FROM therapists;
```

Expected output:
- **Tables**: `users`, `children`, `questions`, `therapists`, `screenings`, `screening_answers`
- **Questions**: 70 rows
- **Therapists**: 12 rows

---

### **Step 4: Configure Database Connection (if needed)**

The default configuration in `db.js` is:
```javascript
host: 'localhost'
user: 'root'
password: '' (empty)
database: 'detection_to_direction'
```

**If your MySQL has a different password**, you have two options:

#### Option A: Create a `.env` file
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password_here
DB_NAME=detection_to_direction
SESSION_SECRET=your_secret_key_here
```

#### Option B: Edit `db.js` directly
Change the password value to match your MySQL root password.

---

### **Step 5: Start the Application**

In your project directory, run:

```powershell
npm start
```

You should see:
```
Server started on http://localhost:3000
```

---

### **Step 6: Open the Application**

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📂 About the Data Files

### **JSON Files in `public/data/`**
These are **CLIENT-SIDE** reference files for potential future use:
- `questions.json` - Front-end reference for question structure
- `therapists.json` - Front-end reference for therapist data
- `i18n/en.json` - Translation strings for internationalization (future feature)

**Note**: The actual data used by the application comes from the **MySQL database**, not these JSON files. The SQL seed files have already imported this data into the database.

### **Why keep them?**
- Documentation and reference
- Future features (offline mode, multi-language support)
- Easy data updates and migrations

---

## ✅ Testing Your Setup

### **1. Create Account**
1. Go to http://localhost:3000
2. Click "Create Account" or go to `/signup.html`
3. Fill in: Name, Email, Password
4. Submit

### **2. Add a Child**
1. Log in with your account
2. Go to "Children" page (`/add_child.html`)
3. Add child's name, age, and optional notes
4. You should see the child appear in a nice card below

### **3. Run a Screening**
1. Go to "Screening" page (`/screening.html`)
2. Select your child from dropdown (should now appear!)
3. Choose a screening type (ASD, ADHD, or Dyslexia)
4. Answer the questionnaire
5. View results with therapist recommendations

### **4. Search Therapists**
1. Go to "Therapists" page (`/therapists.html`)
2. Select condition and location
3. View nearby therapist centers

---

## 🐛 Troubleshooting

### **Problem: `npm start` fails**
**Solution**: Make sure MySQL is running in XAMPP

### **Problem: "Cannot connect to database"**
**Check**:
- MySQL is running in XAMPP
- Database `detection_to_direction` exists
- Password in `db.js` matches your MySQL password

### **Problem: "No children appear in dropdown"**
**Solution**: 
- Make sure you're logged in
- Add a child via the "Children" page first
- Refresh the screening page

### **Problem: "No questions loading"**
**Check**:
- Run `seed_questions.sql` to populate questions table
- Verify: `SELECT COUNT(*) FROM questions;` should return 70

### **Problem: "No therapists found"**
**Check**:
- Run `seed_therapists.sql` to populate therapists table
- Verify: `SELECT COUNT(*) FROM therapists;` should return 12

---

## 🎉 You're All Set!

Your application should now be fully functional with:
- ✅ User authentication
- ✅ Child management
- ✅ 70 screening questions (ASD, ADHD, Dyslexia)
- ✅ 12 therapist centers
- ✅ Modern, beautiful UI design

---

## 📞 Need Help?

If you encounter issues:
1. Check MySQL is running
2. Verify database tables exist
3. Check Node.js console for error messages
4. Check browser console (F12) for JavaScript errors
