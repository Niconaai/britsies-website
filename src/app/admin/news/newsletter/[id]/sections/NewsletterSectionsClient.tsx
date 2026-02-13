// src/app/admin/news/newsletter/[id]/sections/NewsletterSectionsClient.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

type Props = {
  newsletter: Newsletter;
  sections: Section[];
};

export default function NewsletterSectionsClient({ newsletter, sections }: Props) {
  const router = useRouter();

  const handleDelete = async (sectionId: string) => {
    if (!confirm('Is jy seker jy wil hierdie seksie verwyder?')) {
      return;
    }

    const response = await fetch(`/api/newsletter-sections/${sectionId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert('Kon nie seksie verwyder nie.');
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      {/* Header */}
      <div className="mb-6 border-b border-zinc-200 pb-6 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              Nuusbrief Seksies
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Bestuur seksies vir {newsletter.title || `Nuusbrief ${newsletter.edition_number}`}
            </p>
          </div>
          <Link
            href="/admin/news"
            className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Terug na Nuus
          </Link>
        </div>
        
        {/* Newsletter Info Card */}
        <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Uitgawe #{newsletter.edition_number}
            </span>
            {newsletter.date_range && (
              <>
                <span className="text-amber-600 dark:text-amber-500">•</span>
                <span className="text-sm text-amber-800 dark:text-amber-400">
                  {newsletter.date_range}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Section Button */}
      <div className="mb-6">
        <Link
          href={`/admin/news/newsletter/${newsletter.id}/sections/create`}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Voeg Seksie By
        </Link>
      </div>

      {/* Common Section Templates */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
          💡 Algemene Seksies:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { title: 'Van die Hoof se Lessenaar', icon: '📝' },
            { title: 'Sport Hoogtepunte', icon: '⚽' },
            { title: 'Akademiese Prestasies', icon: '📚' },
            { title: 'Kultuur Nuus', icon: '🎭' },
            { title: 'Algemene Aankondigings', icon: '📢' },
            { title: 'Kalendergebeure', icon: '📅' },
            { title: 'Huldigings', icon: '🏆' },
            { title: 'Foto Galery', icon: '📸' },
          ].map((template) => (
            <Link
              key={template.title}
              href={`/admin/news/newsletter/${newsletter.id}/sections/create?template=${encodeURIComponent(template.title)}`}
              className="flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <span>{template.icon}</span>
              <span className="truncate">{template.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sections List */}
      {sections.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                  Volgorde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                  Seksie Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                  Titel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                  Aksies
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
              {sections.map((section) => (
                <tr key={section.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    #{section.section_order}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {section.section_title || 'Geen tipe'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                    {section.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {section.is_published ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Gepubliseer
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Konsep
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-4">
                    <Link
                      href={`/admin/news/newsletter/${newsletter.id}/sections/edit/${section.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Wysig
                    </Link>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Verwyder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
            Geen seksies
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Begin deur jou eerste seksie by hierdie nuusbrief te voeg.
          </p>
          <div className="mt-6">
            <Link
              href={`/admin/news/newsletter/${newsletter.id}/sections/create`}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Voeg Eerste Seksie By
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
