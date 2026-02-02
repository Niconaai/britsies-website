-- Migration: Add Grade Classes, Subjects, and Related Tables
-- Created: 2026-02-01
-- Description: Implements grade class structure for academic staff organization

-- ============================================
-- 1. CREATE SUBJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. CREATE GRADE CLASSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.grade_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g., "8-1", "9-2"
    grade_level INTEGER NOT NULL CHECK (grade_level >= 8 AND grade_level <= 12),
    class_section INTEGER NOT NULL CHECK (class_section >= 1),
    grade_head_id UUID REFERENCES public.staff_members(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(grade_level, class_section)
);

-- ============================================
-- 3. CREATE STAFF_SUBJECTS JUNCTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.staff_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_member_id UUID NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(staff_member_id, subject_id)
);

-- ============================================
-- 4. CREATE CLASS_GUARDIANS JUNCTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.class_guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_member_id UUID NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
    grade_class_id UUID NOT NULL REFERENCES public.grade_classes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(staff_member_id, grade_class_id)
);

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_subjects_is_active ON public.subjects(is_active);
CREATE INDEX IF NOT EXISTS idx_subjects_sort_order ON public.subjects(sort_order);

CREATE INDEX IF NOT EXISTS idx_grade_classes_grade_level ON public.grade_classes(grade_level);
CREATE INDEX IF NOT EXISTS idx_grade_classes_is_active ON public.grade_classes(is_active);
CREATE INDEX IF NOT EXISTS idx_grade_classes_sort_order ON public.grade_classes(sort_order);
CREATE INDEX IF NOT EXISTS idx_grade_classes_grade_head ON public.grade_classes(grade_head_id);

CREATE INDEX IF NOT EXISTS idx_staff_subjects_staff ON public.staff_subjects(staff_member_id);
CREATE INDEX IF NOT EXISTS idx_staff_subjects_subject ON public.staff_subjects(subject_id);

CREATE INDEX IF NOT EXISTS idx_class_guardians_staff ON public.class_guardians(staff_member_id);
CREATE INDEX IF NOT EXISTS idx_class_guardians_class ON public.class_guardians(grade_class_id);

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_guardians ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. CREATE RLS POLICIES (PUBLIC READ ACCESS)
-- ============================================

-- Subjects: Public read, admin write
DROP POLICY IF EXISTS "Subjects are viewable by everyone" ON public.subjects;
CREATE POLICY "Subjects are viewable by everyone" 
    ON public.subjects FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Subjects are manageable by admins" ON public.subjects;
CREATE POLICY "Subjects are manageable by admins" 
    ON public.subjects FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Grade Classes: Public read, admin write
DROP POLICY IF EXISTS "Grade classes are viewable by everyone" ON public.grade_classes;
CREATE POLICY "Grade classes are viewable by everyone" 
    ON public.grade_classes FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Grade classes are manageable by admins" ON public.grade_classes;
CREATE POLICY "Grade classes are manageable by admins" 
    ON public.grade_classes FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Staff Subjects: Public read, admin write
DROP POLICY IF EXISTS "Staff subjects are viewable by everyone" ON public.staff_subjects;
CREATE POLICY "Staff subjects are viewable by everyone" 
    ON public.staff_subjects FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Staff subjects are manageable by admins" ON public.staff_subjects;
CREATE POLICY "Staff subjects are manageable by admins" 
    ON public.staff_subjects FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Class Guardians: Public read, admin write
DROP POLICY IF EXISTS "Class guardians are viewable by everyone" ON public.class_guardians;
CREATE POLICY "Class guardians are viewable by everyone" 
    ON public.class_guardians FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Class guardians are manageable by admins" ON public.class_guardians;
CREATE POLICY "Class guardians are manageable by admins" 
    ON public.class_guardians FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- 8. CREATE UPDATED_AT TRIGGERS
-- ============================================

-- Subjects trigger
CREATE OR REPLACE FUNCTION update_subjects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_subjects_updated_at ON public.subjects;
CREATE TRIGGER trigger_update_subjects_updated_at
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW
    EXECUTE FUNCTION update_subjects_updated_at();

-- Grade Classes trigger
CREATE OR REPLACE FUNCTION update_grade_classes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_grade_classes_updated_at ON public.grade_classes;
CREATE TRIGGER trigger_update_grade_classes_updated_at
    BEFORE UPDATE ON public.grade_classes
    FOR EACH ROW
    EXECUTE FUNCTION update_grade_classes_updated_at();

-- ============================================
-- 9. INSERT SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Sample subjects
INSERT INTO public.subjects (name, sort_order) VALUES
    ('Wiskunde', 1),
    ('Afrikaans', 2),
    ('Engels', 3),
    ('Natuur en Skeikunde', 4),
    ('Lewenswetenskappe', 5),
    ('Geskiedenis', 6),
    ('Geografie', 7),
    ('Rekeningkunde', 8),
    ('Besigheidstudies', 9),
    ('Ekonomie', 10),
    ('Fisiese Wetenskappe', 11),
    ('Lewensoriëntering', 12),
    ('Musiek', 13),
    ('Kuns', 14),
    ('Tegnologie', 15)
ON CONFLICT (name) DO NOTHING;

-- Sample grade classes (8-1 through 12-4)
INSERT INTO public.grade_classes (name, grade_level, class_section, sort_order) VALUES
    ('8-1', 8, 1, 1),
    ('8-2', 8, 2, 2),
    ('8-3', 8, 3, 3),
    ('8-4', 8, 4, 4),
    ('9-1', 9, 1, 5),
    ('9-2', 9, 2, 6),
    ('9-3', 9, 3, 7),
    ('9-4', 9, 4, 8),
    ('10-1', 10, 1, 9),
    ('10-2', 10, 2, 10),
    ('10-3', 10, 3, 11),
    ('10-4', 10, 4, 12),
    ('11-1', 11, 1, 13),
    ('11-2', 11, 2, 14),
    ('11-3', 11, 3, 15),
    ('11-4', 11, 4, 16),
    ('12-1', 12, 1, 17),
    ('12-2', 12, 2, 18),
    ('12-3', 12, 3, 19),
    ('12-4', 12, 4, 20)
ON CONFLICT (grade_level, class_section) DO NOTHING;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
