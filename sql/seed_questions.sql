-- Seed Questions from questions.json
-- Run this after creating the schema

USE detection_to_direction;

-- Clear existing questions (optional)
-- DELETE FROM screening_answers;
-- DELETE FROM questions;

-- ASD Questions
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

-- ADHD Questions
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

-- Dyslexia Questions
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
