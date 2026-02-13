-- Migration: Add Vacancies and Vacancy Applications Tables
-- Created: 2026-02-13
-- Description: Implements vacancy listings and application tracking

-- ============================================
-- 1. CREATE VACANCIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT, -- Vereistes
    closing_date DATE NOT NULL,
    start_date DATE,
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. CREATE VACANCY APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.vacancy_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id UUID NOT NULL REFERENCES public.vacancies(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    cover_letter TEXT,
    cv_url TEXT, -- URL to uploaded CV in storage
    additional_documents JSONB, -- Array of URLs to additional documents
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected')),
    notes TEXT, -- Admin notes
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_vacancies_is_published ON public.vacancies(is_published);
CREATE INDEX IF NOT EXISTS idx_vacancies_is_active ON public.vacancies(is_active);
CREATE INDEX IF NOT EXISTS idx_vacancies_closing_date ON public.vacancies(closing_date);
CREATE INDEX IF NOT EXISTS idx_vacancy_applications_vacancy_id ON public.vacancy_applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_vacancy_applications_status ON public.vacancy_applications(status);
CREATE INDEX IF NOT EXISTS idx_vacancy_applications_created_at ON public.vacancy_applications(created_at DESC);

-- ============================================
-- 4. CREATE UPDATED_AT TRIGGER FUNCTION (if not exists)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. ADD TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE TRIGGER update_vacancies_updated_at
    BEFORE UPDATE ON public.vacancies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vacancy_applications_updated_at
    BEFORE UPDATE ON public.vacancy_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. CREATE STORAGE BUCKET FOR VACANCY APPLICATIONS
-- ============================================
-- Note: This needs to be run with proper permissions
-- You may need to run this separately in Supabase dashboard or with service key

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('vacancy-applications', 'vacancy-applications', false)
-- ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancy_applications ENABLE ROW LEVEL SECURITY;

-- Public can view published and active vacancies
CREATE POLICY "Anyone can view published vacancies"
ON public.vacancies
FOR SELECT
USING (is_published = true AND is_active = true);

-- Authenticated users (admins) can do everything with vacancies
CREATE POLICY "Authenticated users can manage vacancies"
ON public.vacancies
FOR ALL
USING (auth.role() = 'authenticated');

-- Anyone can insert their own application
CREATE POLICY "Anyone can submit vacancy applications"
ON public.vacancy_applications
FOR INSERT
WITH CHECK (true);

-- Authenticated users (admins) can view all applications
CREATE POLICY "Authenticated users can view all applications"
ON public.vacancy_applications
FOR SELECT
USING (auth.role() = 'authenticated');

-- Authenticated users (admins) can update applications
CREATE POLICY "Authenticated users can update applications"
ON public.vacancy_applications
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Authenticated users (admins) can delete applications
CREATE POLICY "Authenticated users can delete applications"
ON public.vacancy_applications
FOR DELETE
USING (auth.role() = 'authenticated');
