-- ==========================================
-- DK KNIGHT BADMINTON ACADEMY - SUPABASE SCHEMA
-- Supabase Project URL: https://hrfspeeekhcijkktbmib.supabase.co
-- ==========================================

-- 1. Create coaches table
CREATE TABLE IF NOT EXISTS coaches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Head Coach',
    avatar TEXT DEFAULT '🏸',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default 2 coaches
INSERT INTO coaches (id, name, role, avatar) VALUES
('coach_1', 'โค้ช A (Coach A)', 'Head Coach', '🏸'),
('coach_2', 'โค้ช B (Coach B)', 'Assistant Coach', '🏸')
ON CONFLICT (id) DO NOTHING;

-- 2. Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    age INT,
    phone TEXT,
    parent_phone TEXT,
    course_type TEXT NOT NULL CHECK (course_type IN ('group', 'private')),
    course_name TEXT NOT NULL,
    total_sessions INT NOT NULL DEFAULT 8,
    remaining_sessions INT NOT NULL DEFAULT 8,
    price NUMERIC NOT NULL DEFAULT 3500,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    start_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create attendance_logs table
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    coach_id TEXT REFERENCES coaches(id),
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    notes TEXT,
    remaining_after INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create skill_evaluations table
CREATE TABLE IF NOT EXISTS skill_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    coach_id TEXT REFERENCES coaches(id),
    footwork INT CHECK (footwork BETWEEN 1 AND 5),
    serve INT CHECK (serve BETWEEN 1 AND 5),
    forehand INT CHECK (forehand BETWEEN 1 AND 5),
    net_control INT CHECK (net_control BETWEEN 1 AND 5),
    defense INT CHECK (defense BETWEEN 1 AND 5),
    evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS & set public policy for easy connection
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read coaches" ON coaches;
CREATE POLICY "Public read coaches" ON coaches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public all students" ON students;
CREATE POLICY "Public all students" ON students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all attendance" ON attendance_logs;
CREATE POLICY "Public all attendance" ON attendance_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public all evaluations" ON skill_evaluations;
CREATE POLICY "Public all evaluations" ON skill_evaluations FOR ALL USING (true) WITH CHECK (true);
