// src/app/admin/news/NewsAdminClient.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { deletePost } from './actions';

type NewsPost = {
    id: string;
    title: string | null;
    is_published: boolean | null;
    published_at: string | null;
    created_at: string;
    publication_type: string | null;
    edition_number: number | null;
};

type NewsAdminClientProps = {
    allPosts: NewsPost[];
};

export default function NewsAdminClient({ allPosts }: NewsAdminClientProps) {
    const [activeTab, setActiveTab] = useState<'news' | 'newsletters'>('news');

    // Filter posts based on active tab
    const filteredPosts = allPosts.filter(post => {
        if (activeTab === 'news') {
            return post.publication_type === 'news';
        } else {
            return post.publication_type === 'newsletter';
        }
    });

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    Nuus & Nuusbrief Bestuur
                </h1>
                <div className="flex gap-2">
                    <Link
                        href="/admin/news/create?type=news"
                        className="rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        + Nuwe Nuus
                    </Link>
                    <Link
                        href="/admin/news/create?type=newsletter"
                        className="rounded-md bg-amber-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                        + Nuwe Nuusbrief
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-zinc-200 dark:border-zinc-700">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`${
                            activeTab === 'news'
                                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                        } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
                    >
                        Individuele Nuus
                        <span className="ml-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs dark:bg-zinc-700">
                            {allPosts.filter(p => p.publication_type === 'news').length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('newsletters')}
                        className={`${
                            activeTab === 'newsletters'
                                ? 'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400'
                                : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                        } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
                    >
                        Nuusbriewe
                        <span className="ml-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs dark:bg-zinc-700">
                            {allPosts.filter(p => p.publication_type === 'newsletter').length}
                        </span>
                    </button>
                </nav>
            </div>

            {/* Posts Table */}
            {filteredPosts.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                        <thead className="bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                {activeTab === 'newsletters' && (
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                                        Uitgawe #
                                    </th>
                                )}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                                    Titel
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                                    Gepubliseer Op
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                                    Aksies
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                            {filteredPosts.map((post) => (
                                <tr key={post.id}>
                                    {activeTab === 'newsletters' && (
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                                                #{post.edition_number || '?'}
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                                        {post.title ?? 'Geen titel'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {post.is_published ? (
                                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                Gepubliseer
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                Konsep
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                        {post.is_published 
                                            ? new Date(post.published_at!).toLocaleDateString('af-ZA')
                                            : '-'
                                        }
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-4">
                                        <Link
                                            href={`/admin/news/edit/${post.id}`}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Wysig
                                        </Link>
                                        {activeTab === 'newsletters' && (
                                            <Link
                                                href={`/admin/news/newsletter/${post.id}/sections`}
                                                className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                            >
                                                Seksies
                                            </Link>
                                        )}
                                        <form action={deletePost} className="inline">
                                            <input type="hidden" name="postId" value={post.id} />
                                            <button
                                                type="submit"
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                onClick={(e) => {
                                                    if (!confirm('Is jy seker jy wil hierdie item verwyder?')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                Verwyder
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-zinc-500 dark:text-zinc-400">
                        {activeTab === 'news' 
                            ? 'Geen individuele nuusberigte gevind nie.' 
                            : 'Geen nuusbriewe gevind nie.'
                        }
                    </p>
                    <Link
                        href={`/admin/news/create?type=${activeTab === 'news' ? 'news' : 'newsletter'}`}
                        className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                        + Skep jou eerste {activeTab === 'news' ? 'nuusberig' : 'nuusbrief'}
                    </Link>
                </div>
            )}
        </div>
    );
}
