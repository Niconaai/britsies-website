-- Migration: Newsletter System Support
-- Created: 2026-02-14
-- Description: Extends news_posts table to support both individual news items and newsletter editions

-- Add new columns to news_posts table
ALTER TABLE news_posts
ADD COLUMN IF NOT EXISTS publication_type TEXT DEFAULT 'news' CHECK (publication_type IN ('news', 'newsletter', 'newsletter_section')),
ADD COLUMN IF NOT EXISTS edition_number INTEGER,
ADD COLUMN IF NOT EXISTS date_range TEXT,
ADD COLUMN IF NOT EXISTS section_order INTEGER,
ADD COLUMN IF NOT EXISTS section_title TEXT,
ADD COLUMN IF NOT EXISTS parent_newsletter_id UUID REFERENCES news_posts(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_news_posts_publication_type ON news_posts(publication_type);
CREATE INDEX IF NOT EXISTS idx_news_posts_parent_newsletter ON news_posts(parent_newsletter_id);
CREATE INDEX IF NOT EXISTS idx_news_posts_edition_number ON news_posts(edition_number) WHERE publication_type = 'newsletter';

-- Add comment to explain the structure
COMMENT ON COLUMN news_posts.publication_type IS 'Type: news (individual posts), newsletter (edition container), newsletter_section (part of newsletter)';
COMMENT ON COLUMN news_posts.edition_number IS 'Newsletter edition number (e.g., 1, 2, 3...). Only used when publication_type = newsletter';
COMMENT ON COLUMN news_posts.date_range IS 'Date range for newsletter edition (e.g., "6-12 Februarie 2026")';
COMMENT ON COLUMN news_posts.section_order IS 'Order of section within newsletter. Used for newsletter_section type';
COMMENT ON COLUMN news_posts.section_title IS 'Title of section within newsletter (e.g., "Van die Hoof", "Sport Hoogtepunte")';
COMMENT ON COLUMN news_posts.parent_newsletter_id IS 'References the parent newsletter when publication_type = newsletter_section';

-- Create a view for easy querying of newsletter editions with their sections
CREATE OR REPLACE VIEW newsletter_editions_with_sections AS
SELECT 
    n.id,
    n.title,
    n.slug,
    n.edition_number,
    n.date_range,
    n.published_at,
    n.created_at,
    n.is_published,
    n.image_urls,
    (
        SELECT json_agg(
            json_build_object(
                'id', s.id,
                'title', s.title,
                'section_title', s.section_title,
                'slug', s.slug,
                'content', s.content,
                'image_urls', s.image_urls,
                'section_order', s.section_order
            ) ORDER BY s.section_order ASC
        )
        FROM news_posts s
        WHERE s.parent_newsletter_id = n.id
        AND s.publication_type = 'newsletter_section'
        AND s.is_published = true
    ) as sections
FROM news_posts n
WHERE n.publication_type = 'newsletter'
ORDER BY n.edition_number DESC;

COMMENT ON VIEW newsletter_editions_with_sections IS 'View that returns newsletter editions with their sections as JSON array';
