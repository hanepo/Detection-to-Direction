-- Seed Therapists from therapists.json
-- Run this after creating the schema

USE detection_to_direction;

-- Clear existing therapists (optional)
-- DELETE FROM therapists;

-- Insert therapist centers
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
