// src/app/admin/news/newsletter/[id]/sections/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import NewsletterSectionsClient from './NewsletterSectionsClient';

type Newsletter = {
  id: string;
  title: string | null;
  edition_number: number | null;
  date_range: string | null;
};

type Section = {
  id: string;
  title: string | null;
  section_title: string | null;
  section_order: number | null;
  is_published: boolean | null;
};

export default async function NewsletterSectionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch newsletter
  const { data: newsletter, error: newsletterError } = await supabase
    .from('news_posts')
    .select('id, title, edition_number, date_range')
    .eq('id', id)
    .eq('publication_type', 'newsletter')
    .single();

  if (newsletterError || !newsletter) {
    notFound();
  }

  // Fetch sections for this newsletter
  const { data: sections, error: sectionsError } = await supabase
    .from('news_posts')
    .select('id, title, section_title, section_order, is_published')
    .eq('parent_newsletter_id', id)
    .eq('publication_type', 'newsletter_section')
    .order('section_order', { ascending: true });

  if (sectionsError) {
    console.error('Error fetching sections:', sectionsError);
  }

  return (
    <NewsletterSectionsClient
      newsletter={newsletter as Newsletter}
      sections={(sections as Section[]) || []}
    />
  );
}
