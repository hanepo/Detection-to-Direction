-- ALL-IN-ONE SETUP SCRIPT
-- Run this ONCE in phpMyAdmin SQL tab
-- This will create everything you need

-- ============================================
-- STEP 1: Create Database
-- ============================================
CREATE DATABASE IF NOT EXISTS detection_to_direction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE detection_to_direction;

-- ============================================
-- STEP 2: Drop existing tables (if any)
-- ============================================
DROP TABLE IF EXISTS screening_answers;
DROP TABLE IF EXISTS screenings;
DROP TABLE IF EXISTS therapists;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS children;
DROP TABLE IF EXISTS users;

-- ============================================
-- STEP 3: Create Tables
-- ============================================

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Children table
CREATE TABLE children (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions table
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id VARCHAR(50) UNIQUE NOT NULL,
  disorder ENUM('ASD', 'ADHD', 'Dyslexia') NOT NULL,
  question_text TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_disorder (disorder),
  INDEX idx_question_id (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Therapists table
CREATE TABLE therapists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  therapist_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  specializations JSON NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  postcode VARCHAR(20),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  whatsapp VARCHAR(50),
  hours TEXT,
  services JSON,
  coordinates JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_state (state),
  INDEX idx_city (city),
  INDEX idx_therapist_id (therapist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Screenings table
CREATE TABLE screenings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT NOT NULL,
  screening_date DATETIME NOT NULL,
  asd_score INT DEFAULT 0,
  adhd_score INT DEFAULT 0,
  dyslexia_score INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  INDEX idx_child_id (child_id),
  INDEX idx_screening_date (screening_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Screening answers table
CREATE TABLE screening_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  screening_id INT NOT NULL,
  question_id INT NOT NULL,
  answer_score INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_screening_id (screening_id),
  INDEX idx_question_id (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STEP 4: Insert Questions (70 total)
-- ============================================

-- ASD Questions (20)
INSERT INTO questions (question_id, disorder, question_text, category) VALUES
('asd_1', 'ASD', 'Does your child have difficulty making eye contact during conversations?', 'social'),
('asd_2', 'ASD', 'Does your child struggle to understand other people\'s feelings or emotions?', 'social'),
('asd_3', 'ASD', 'Does your child prefer to play alone rather than with other children?', 'social'),
('asd_4', 'ASD', 'Does your child have difficulty starting or maintaining conversations?', 'communication'),
('asd_5', 'ASD', 'Does your child repeat words or phrases over and over (echolalia)?', 'communication'),
('asd_6', 'ASD', 'Does your child take things literally and have trouble understanding sarcasm or jokes?', 'communication'),
('asd_7', 'ASD', 'Does your child have very specific routines and get upset when they change?', 'behavior'),
('asd_8', 'ASD', 'Does your child have intense interests in specific topics or objects?', 'behavior'),
('asd_9', 'ASD', 'Does your child engage in repetitive movements (hand flapping, rocking, spinning)?', 'behavior'),
('asd_10', 'ASD', 'Is your child overly sensitive to sounds, lights, textures, or smells?', 'sensory'),
('asd_11', 'ASD', 'Does your child have difficulty understanding personal space?', 'social'),
('asd_12', 'ASD', 'Does your child struggle with changes in daily routine or environment?', 'behavior'),
('asd_13', 'ASD', 'Does your child have difficulty understanding non-verbal cues (facial expressions, body language)?', 'social'),
('asd_14', 'ASD', 'Does your child speak in an unusual tone or rhythm?', 'communication'),
('asd_15', 'ASD', 'Does your child have difficulty with pretend or imaginative play?', 'social'),
('asd_16', 'ASD', 'Does your child line up toys or objects in specific patterns?', 'behavior'),
('asd_17', 'ASD', 'Does your child become extremely focused on parts of objects (like wheels on a toy car)?', 'behavior'),
('asd_18', 'ASD', 'Does your child have difficulty sharing interests or achievements with others?', 'social'),
('asd_19', 'ASD', 'Does your child avoid or resist physical touch or affection?', 'sensory'),
('asd_20', 'ASD', 'Does your child have difficulty understanding rules in social situations or games?', 'social');

-- ADHD Questions (25)
INSERT INTO questions (question_id, disorder, question_text, category) VALUES
('adhd_1', 'ADHD', 'Does your child have difficulty paying attention to details or make careless mistakes?', 'inattention'),
('adhd_2', 'ADHD', 'Does your child have trouble staying focused during tasks, play, or conversations?', 'inattention'),
('adhd_3', 'ADHD', 'Does your child seem not to listen when spoken to directly?', 'inattention'),
('adhd_4', 'ADHD', 'Does your child have difficulty following through on instructions or finishing tasks?', 'inattention'),
('adhd_5', 'ADHD', 'Does your child have difficulty organizing tasks and activities?', 'inattention'),
('adhd_6', 'ADHD', 'Does your child avoid tasks that require sustained mental effort?', 'inattention'),
('adhd_7', 'ADHD', 'Does your child frequently lose things necessary for tasks or activities?', 'inattention'),
('adhd_8', 'ADHD', 'Is your child easily distracted by external stimuli?', 'inattention'),
('adhd_9', 'ADHD', 'Is your child forgetful in daily activities?', 'inattention'),
('adhd_10', 'ADHD', 'Does your child fidget with hands or feet or squirm in seat?', 'hyperactivity'),
('adhd_11', 'ADHD', 'Does your child leave their seat when remaining seated is expected?', 'hyperactivity'),
('adhd_12', 'ADHD', 'Does your child run about or climb in situations where it is inappropriate?', 'hyperactivity'),
('adhd_13', 'ADHD', 'Does your child have difficulty playing or engaging in leisure activities quietly?', 'hyperactivity'),
('adhd_14', 'ADHD', 'Is your child often "on the go" or acts as if "driven by a motor"?', 'hyperactivity'),
('adhd_15', 'ADHD', 'Does your child talk excessively?', 'hyperactivity'),
('adhd_16', 'ADHD', 'Does your child blurt out answers before questions have been completed?', 'impulsivity'),
('adhd_17', 'ADHD', 'Does your child have difficulty waiting their turn?', 'impulsivity'),
('adhd_18', 'ADHD', 'Does your child interrupt or intrude on others?', 'impulsivity'),
('adhd_19', 'ADHD', 'Does your child have difficulty controlling emotions or frequent mood swings?', 'emotional'),
('adhd_20', 'ADHD', 'Does your child become frustrated easily when tasks are challenging?', 'emotional'),
('adhd_21', 'ADHD', 'Does your child have trouble completing homework or school assignments?', 'academic'),
('adhd_22', 'ADHD', 'Does your child rush through activities without checking work?', 'impulsivity'),
('adhd_23', 'ADHD', 'Does your child have difficulty transitioning between activities?', 'executive'),
('adhd_24', 'ADHD', 'Does your child lose track of time during preferred activities?', 'inattention'),
('adhd_25', 'ADHD', 'Does your child have difficulty remembering multi-step instructions?', 'executive');

-- Dyslexia Questions (25)
INSERT INTO questions (question_id, disorder, question_text, category) VALUES
('dys_1', 'Dyslexia', 'Does your child have difficulty recognizing letters or learning the alphabet?', 'reading'),
('dys_2', 'Dyslexia', 'Does your child struggle with rhyming words or word sounds?', 'phonological'),
('dys_3', 'Dyslexia', 'Does your child have trouble sounding out new or unfamiliar words?', 'phonological'),
('dys_4', 'Dyslexia', 'Does your child reverse letters or numbers when reading or writing (b/d, p/q)?', 'reading'),
('dys_5', 'Dyslexia', 'Does your child read significantly below grade level?', 'reading'),
('dys_6', 'Dyslexia', 'Does your child avoid reading activities or express frustration when reading?', 'behavioral'),
('dys_7', 'Dyslexia', 'Does your child have difficulty spelling common words?', 'writing'),
('dys_8', 'Dyslexia', 'Does your child confuse similar-looking words when reading?', 'reading'),
('dys_9', 'Dyslexia', 'Does your child have trouble remembering sequences (days of week, months)?', 'memory'),
('dys_10', 'Dyslexia', 'Does your child take much longer than peers to complete reading assignments?', 'reading'),
('dys_11', 'Dyslexia', 'Does your child have difficulty following written instructions?', 'comprehension'),
('dys_12', 'Dyslexia', 'Does your child struggle to learn new vocabulary words?', 'language'),
('dys_13', 'Dyslexia', 'Does your child have trouble organizing thoughts when writing?', 'writing'),
('dys_14', 'Dyslexia', 'Does your child mix up the order of letters in words?', 'writing'),
('dys_15', 'Dyslexia', 'Does your child have poor handwriting or inconsistent spacing?', 'writing'),
('dys_16', 'Dyslexia', 'Does your child have difficulty with phonics activities?', 'phonological'),
('dys_17', 'Dyslexia', 'Does your child struggle to remember what was read?', 'comprehension'),
('dys_18', 'Dyslexia', 'Does your child have difficulty distinguishing between left and right?', 'spatial'),
('dys_19', 'Dyslexia', 'Does your child perform better when information is presented verbally vs. in writing?', 'learning'),
('dys_20', 'Dyslexia', 'Does your child have a family history of reading difficulties?', 'background'),
('dys_21', 'Dyslexia', 'Does your child struggle with learning multiplication tables or math facts?', 'academic'),
('dys_22', 'Dyslexia', 'Does your child have difficulty copying text from board or book?', 'visual'),
('dys_23', 'Dyslexia', 'Does your child complain of words moving or blurring when reading?', 'visual'),
('dys_24', 'Dyslexia', 'Does your child have trouble with word retrieval (knowing the word but can\'t say it)?', 'language'),
('dys_25', 'Dyslexia', 'Does your child show signs of frustration or low self-esteem about school?', 'emotional');

-- ============================================
-- STEP 5: Insert Therapists (12 centers)
-- ============================================

INSERT INTO therapists (therapist_id, name, specializations, address, city, state, postcode, phone, email, website, whatsapp, hours, services, coordinates) VALUES
('tc_001', 'Bright Futures Therapy Center', 
 JSON_ARRAY('ASD', 'ADHD'), 
 '123 Jalan Ampang', 'Kuala Lumpur', 'Wilayah Persekutuan', '50450',
 '+60-3-2161-1234', 'info@brightfutures.my', 'https://brightfutures.my', '+60123456789',
 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM',
 JSON_ARRAY('Behavioral therapy', 'Speech therapy', 'Occupational therapy'),
 JSON_OBJECT('lat', 3.1570, 'lng', 101.7123)),

('tc_002', 'Learning Tree Development Center',
 JSON_ARRAY('Dyslexia', 'ADHD'),
 '456 Jalan Tun Razak', 'Kuala Lumpur', 'Wilayah Persekutuan', '50400',
 '+60-3-2162-5678', 'contact@learningtree.my', 'https://learningtree.my', '+60123456790',
 'Mon-Fri: 8:30 AM - 5:30 PM',
 JSON_ARRAY('Reading intervention', 'Educational therapy', 'Assessment'),
 JSON_OBJECT('lat', 3.1590, 'lng', 101.7200)),

('tc_003', 'Spectrum Care Clinic',
 JSON_ARRAY('ASD'),
 '789 Jalan Damansara', 'Petaling Jaya', 'Selangor', '47301',
 '+60-3-7956-1234', 'hello@spectrumcare.my', 'https://spectrumcare.my', '+60123456791',
 'Mon-Sat: 9:00 AM - 7:00 PM',
 JSON_ARRAY('ABA therapy', 'Social skills training', 'Parent coaching'),
 JSON_OBJECT('lat', 3.0738, 'lng', 101.6006)),

('tc_004', 'Focus Kids Therapy',
 JSON_ARRAY('ADHD'),
 '321 Jalan Gasing', 'Petaling Jaya', 'Selangor', '46000',
 '+60-3-7956-5678', 'info@focuskids.my', 'https://focuskids.my', '+60123456792',
 'Mon-Fri: 10:00 AM - 8:00 PM, Sat: 9:00 AM - 5:00 PM',
 JSON_ARRAY('Attention training', 'Behavioral management', 'Family therapy'),
 JSON_OBJECT('lat', 3.0901, 'lng', 101.6450)),

('tc_005', 'Reading Stars Center',
 JSON_ARRAY('Dyslexia'),
 '654 Jalan Bangsar', 'Kuala Lumpur', 'Wilayah Persekutuan', '59100',
 '+60-3-2282-1234', 'contact@readingstars.my', 'https://readingstars.my', '+60123456793',
 'Mon-Fri: 9:00 AM - 6:00 PM',
 JSON_ARRAY('Orton-Gillingham method', 'Reading fluency', 'Phonics instruction'),
 JSON_OBJECT('lat', 3.1285, 'lng', 101.6691)),

('tc_006', 'Rainbow Development Hub',
 JSON_ARRAY('ASD', 'ADHD', 'Dyslexia'),
 '888 Jalan Ipoh', 'Kuala Lumpur', 'Wilayah Persekutuan', '51200',
 '+60-3-4042-1234', 'info@rainbowhub.my', 'https://rainbowhub.my', '+60123456794',
 'Mon-Sat: 8:00 AM - 7:00 PM',
 JSON_ARRAY('Comprehensive assessment', 'Individual therapy', 'Group sessions', 'Parent training'),
 JSON_OBJECT('lat', 3.1844, 'lng', 101.6901)),

('tc_007', 'Mindful Kids Therapy Center',
 JSON_ARRAY('ADHD', 'ASD'),
 '147 Jalan Bukit Bintang', 'Kuala Lumpur', 'Wilayah Persekutuan', '55100',
 '+60-3-2141-5678', 'hello@mindfukids.my', 'https://mindfukids.my', '+60123456795',
 'Mon-Fri: 9:00 AM - 7:00 PM, Sat: 9:00 AM - 3:00 PM',
 JSON_ARRAY('Cognitive behavioral therapy', 'Mindfulness training', 'Social skills'),
 JSON_OBJECT('lat', 3.1466, 'lng', 101.7101)),

('tc_008', 'Horizon Learning Center',
 JSON_ARRAY('Dyslexia', 'ADHD'),
 '258 Jalan Sultan Ismail', 'Kuala Lumpur', 'Wilayah Persekutuan', '50250',
 '+60-3-2693-1234', 'info@horizonlearning.my', 'https://horizonlearning.my', '+60123456796',
 'Mon-Fri: 10:00 AM - 7:00 PM',
 JSON_ARRAY('Educational assessment', 'Tutoring', 'Study skills'),
 JSON_OBJECT('lat', 3.1560, 'lng', 101.7088)),

('tc_009', 'Stepping Stones Clinic',
 JSON_ARRAY('ASD'),
 '369 Jalan Klang Lama', 'Kuala Lumpur', 'Wilayah Persekutuan', '58000',
 '+60-3-7982-1234', 'contact@steppingstones.my', 'https://steppingstones.my', '+60123456797',
 'Mon-Sat: 9:00 AM - 6:00 PM',
 JSON_ARRAY('Early intervention', 'Speech therapy', 'Occupational therapy', 'ABA'),
 JSON_OBJECT('lat', 3.1030, 'lng', 101.6790)),

('tc_010', 'Achievers Learning Hub',
 JSON_ARRAY('Dyslexia'),
 '741 Jalan Cheras', 'Kuala Lumpur', 'Wilayah Persekutuan', '56100',
 '+60-3-9132-5678', 'info@achievershub.my', 'https://achievershub.my', '+60123456798',
 'Mon-Fri: 2:00 PM - 8:00 PM, Sat-Sun: 9:00 AM - 5:00 PM',
 JSON_ARRAY('Specialized reading programs', 'Writing skills', 'Test preparation'),
 JSON_OBJECT('lat', 3.1164, 'lng', 101.7223)),

('tc_011', 'Harmony Therapy Services',
 JSON_ARRAY('ASD', 'ADHD'),
 '852 Jalan Pahang', 'Kuala Lumpur', 'Wilayah Persekutuan', '53000',
 '+60-3-4021-1234', 'hello@harmonytherapy.my', 'https://harmonytherapy.my', '+60123456799',
 'Mon-Fri: 9:00 AM - 6:00 PM',
 JSON_ARRAY('Play therapy', 'Sensory integration', 'Parent consultation'),
 JSON_OBJECT('lat', 3.1710, 'lng', 101.7050)),

('tc_012', 'Little Champions Center',
 JSON_ARRAY('ADHD', 'Dyslexia'),
 '963 Jalan Kepong', 'Kuala Lumpur', 'Wilayah Persekutuan', '52100',
 '+60-3-6257-5678', 'info@littlechampions.my', 'https://littlechampions.my', '+60123456800',
 'Mon-Fri: 10:00 AM - 7:00 PM, Sat: 9:00 AM - 2:00 PM',
 JSON_ARRAY('Executive function training', 'Academic coaching', 'Behavioral support'),
 JSON_OBJECT('lat', 3.2111, 'lng', 101.6389));

-- ============================================
-- DONE! Verify the setup:
-- ============================================
-- Run these queries to verify:
-- SELECT COUNT(*) as total_questions FROM questions;  (should be 70)
-- SELECT COUNT(*) as total_therapists FROM therapists;  (should be 12)
-- SHOW TABLES;  (should show 6 tables)
