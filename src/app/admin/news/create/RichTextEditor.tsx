// src/app/admin/news/create/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
//import { useCallback } from 'react';
import { useCallback, useState, useEffect } from 'react';

// Toolbar Component (Keep the slightly improved button contrast version)
const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }
    const getButtonClass = (isActive: boolean): string => {
        return `rounded p-1 border border-transparent hover:bg-zinc-200 hover:border-zinc-300 dark:hover:bg-zinc-600 dark:hover:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${isActive ? 'bg-zinc-200 border-zinc-300 dark:bg-zinc-600 dark:border-zinc-500' : 'bg-transparent'
            }`;
    };

    const toggleBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor]);
    // ... (rest of MenuBar callbacks: toggleBold, etc.) ...
    return (
        <div className="flex flex-wrap gap-1 rounded-t-md border border-zinc-300 bg-zinc-100 p-2 dark:border-zinc-600 dark:bg-zinc-700">
            {/* Buttons using getButtonClass... */}
            <button type="button" onClick={toggleBold} className={getButtonClass(editor.isActive('bold'))}>B</button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={getButtonClass(editor.isActive('italic'))}>_I_</button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={getButtonClass(editor.isActive('strike'))}>~S~</button>
            <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={getButtonClass(editor.isActive('paragraph'))}>P</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={getButtonClass(editor.isActive('heading', { level: 1 }))}>H1</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={getButtonClass(editor.isActive('heading', { level: 2 }))}>H2</button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={getButtonClass(editor.isActive('bulletList'))}>UL</button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={getButtonClass(editor.isActive('orderedList'))}>OL</button>
        </div>
    );
};

// Main Editor Component
export default function RichTextEditor({
    initialContent = '',
    onChange,
}: {
    initialContent?: string;
    onChange?: (richText: string) => void;
}) {

    const [htmlContent, setHtmlContent] = useState<string>(initialContent);

    const editor = useEditor({
        immediatelyRender: false, // Keep this fix
        extensions: [StarterKit],
        content: initialContent,
        editorProps: {
            attributes: {
                // --- Reverted classes ---
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] border-x border-b border-zinc-300 dark:border-zinc-600 rounded-b-md p-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white',
                // --- End Reverted classes ---
            },
        },
        onUpdate({ editor }) {
            const currentHtml = editor.getHTML();
            setHtmlContent(currentHtml); // Update internal state
            if (onChange) {
                onChange(currentHtml); // Call prop if provided
            }
        },
    });

    useEffect(() => {
    if (editor && editor.getHTML() !== htmlContent) {
       setHtmlContent(editor.getHTML());
    }
   // Run only when initialContent changes or editor becomes available
   }, [editor, initialContent, htmlContent]);

    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            <input type="hidden" name="content" value={editor?.getHTML() ?? ''} />
        </div>
    );
}