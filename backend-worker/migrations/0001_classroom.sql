PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS sl_users (
 id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE COLLATE NOCASE, auth_email TEXT NOT NULL UNIQUE,
 name TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','student')), active INTEGER NOT NULL DEFAULT 1,
 must_change INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS sl_one_admin ON sl_users(role) WHERE role='admin';
CREATE TABLE IF NOT EXISTS sl_sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES sl_users(id), expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS sl_sessions_user ON sl_sessions(user_id);
CREATE TABLE IF NOT EXISTS sl_classes (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, grade TEXT NOT NULL, room TEXT NOT NULL, year TEXT NOT NULL,
 term INTEGER NOT NULL CHECK(term IN (1,2)), subject TEXT NOT NULL CHECK(subject IN ('basic','additional')), active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS sl_enrollments (
 class_id TEXT NOT NULL REFERENCES sl_classes(id), user_id TEXT NOT NULL REFERENCES sl_users(id), active INTEGER NOT NULL DEFAULT 1,
 PRIMARY KEY(class_id,user_id)
);
CREATE INDEX IF NOT EXISTS sl_enrollments_student ON sl_enrollments(user_id,active);
CREATE TABLE IF NOT EXISTS sl_lessons (
 id TEXT PRIMARY KEY, class_id TEXT NOT NULL REFERENCES sl_classes(id), title TEXT NOT NULL, lesson_date TEXT NOT NULL,
 notes TEXT NOT NULL DEFAULT '', video_url TEXT NOT NULL DEFAULT '', published INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS sl_lessons_class ON sl_lessons(class_id,published,lesson_date);
CREATE TABLE IF NOT EXISTS sl_items (
 id TEXT PRIMARY KEY, class_id TEXT NOT NULL REFERENCES sl_classes(id), lesson_id TEXT REFERENCES sl_lessons(id),
 title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', category TEXT NOT NULL CHECK(category IN ('coursework','midterm','final')),
 max_score REAL NOT NULL CHECK(max_score>0), accepts_submission INTEGER NOT NULL DEFAULT 1,
 due_at TEXT, published INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS sl_items_class ON sl_items(class_id,published);
CREATE TABLE IF NOT EXISTS sl_submissions (
 id TEXT PRIMARY KEY, item_id TEXT NOT NULL REFERENCES sl_items(id), user_id TEXT NOT NULL REFERENCES sl_users(id),
 mode TEXT NOT NULL CHECK(mode IN ('online','paper')), note TEXT NOT NULL DEFAULT '', submitted_at TEXT NOT NULL,
 reopened INTEGER NOT NULL DEFAULT 0, revision TEXT NOT NULL, UNIQUE(item_id,user_id)
);
CREATE TABLE IF NOT EXISTS sl_scores (
 item_id TEXT NOT NULL REFERENCES sl_items(id), user_id TEXT NOT NULL REFERENCES sl_users(id),
 score REAL NOT NULL CHECK(score>=0), feedback TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL, PRIMARY KEY(item_id,user_id)
);
CREATE TABLE IF NOT EXISTS sl_followups (
 class_id TEXT NOT NULL REFERENCES sl_classes(id), user_id TEXT NOT NULL REFERENCES sl_users(id),
 note TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL, PRIMARY KEY(class_id,user_id)
);
CREATE TABLE IF NOT EXISTS sl_files (
 id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES sl_users(id), lesson_id TEXT REFERENCES sl_lessons(id), item_id TEXT REFERENCES sl_items(id),
 drive_id TEXT NOT NULL, name TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, created_at TEXT NOT NULL,
 CHECK((lesson_id IS NOT NULL AND item_id IS NULL) OR (item_id IS NOT NULL AND lesson_id IS NULL))
);
CREATE INDEX IF NOT EXISTS sl_files_lesson ON sl_files(lesson_id);
CREATE INDEX IF NOT EXISTS sl_files_item ON sl_files(item_id,owner_id);
CREATE TABLE IF NOT EXISTS sl_submission_files (
 submission_id TEXT NOT NULL REFERENCES sl_submissions(id), file_id TEXT NOT NULL REFERENCES sl_files(id), PRIMARY KEY(submission_id,file_id)
);
CREATE TABLE IF NOT EXISTS sl_settings (key TEXT PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sl_oauth_states (state_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES sl_users(id),verifier TEXT NOT NULL,expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sl_login_limits (key TEXT PRIMARY KEY,attempts INTEGER NOT NULL,expires_at INTEGER NOT NULL);
