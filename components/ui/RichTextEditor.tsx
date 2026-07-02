'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { Markdown } from 'tiptap-markdown'
import { useEffect, useRef, useState } from 'react'
import {
  Bold, Italic, Code, Heading2, Heading3, List, ListOrdered,
  Quote, Link2, Image as ImageIcon, Minus, Table as TableIcon,
  Undo2, Redo2, X,
} from 'lucide-react'
import ImagePicker from './ImagePicker'

interface Props {
  /** Markdown string */
  value: string
  /** Called with the serialized markdown on every change */
  onChange: (markdown: string) => void
  uploadUrl?: string
  folder?: string
  placeholder?: string
  minHeight?: number
}

/**
 * WYSIWYG editor (TipTap) yang menyimpan & memuat konten sebagai **markdown**,
 * sehingga artikel lama dan rendering blog (yang berbasis markdown) tetap kompatibel.
 * Dipakai bersama oleh admin ArticlesTab & writer dashboard.
 */
export default function RichTextEditor({
  value,
  onChange,
  uploadUrl = '/api/admin/upload',
  folder = 'assets',
  placeholder = 'Tulis konten artikel di sini...',
  minHeight = 440,
}: Props) {
  const [showImage, setShowImage] = useState(false)
  // Nilai markdown terakhir yang KITA pancarkan — untuk membedakan perubahan
  // dari luar (ganti artikel) vs echo ketikan sendiri, agar kursor tak melompat.
  const lastEmitted = useRef(value)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown.configure({ html: false, transformPastedText: true, transformCopiedText: true, linkify: true, breaks: false }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-stone max-w-none focus:outline-none px-5 py-4',
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => {
      const md = editor.storage.markdown.getMarkdown()
      lastEmitted.current = md
      onChange(md)
    },
  })

  // Sinkronisasi bila `value` diganti dari luar (mis. buka artikel lain)
  useEffect(() => {
    if (!editor) return
    if (value !== lastEmitted.current) {
      lastEmitted.current = value
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  if (!editor) {
    return <div className="border border-gray-200 rounded-xl bg-white" style={{ minHeight: minHeight + 48 }} />
  }

  const insertImage = (url: string, alt: string) => {
    if (!url) return
    editor.chain().focus().setImage({ src: url, alt }).run()
    setShowImage(false)
  }

  const toggleLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL tautan:', prev ?? 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5 sticky top-0 z-10">
        <TB icon={Undo2} title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
        <TB icon={Redo2} title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
        <Sep />
        <TB icon={Heading2} title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} />
        <TB icon={Heading3} title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} />
        <Sep />
        <TB icon={Bold} title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} />
        <TB icon={Italic} title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} />
        <TB icon={Code} title="Inline Code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} />
        <Sep />
        <TB icon={List} title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} />
        <TB icon={ListOrdered} title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} />
        <TB icon={Quote} title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} />
        <Sep />
        <TB icon={ImageIcon} title="Sisipkan Gambar" onClick={() => setShowImage(true)} accent />
        <TB icon={Link2} title="Sisipkan/Ubah Link" onClick={toggleLink} active={editor.isActive('link')} accent />
        <TB icon={TableIcon} title="Sisipkan Tabel" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} accent />
        <Sep />
        <TB icon={Minus} title="Garis Pemisah" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      </div>

      {/* Editing surface */}
      <EditorContent editor={editor} />

      {/* Modal upload gambar */}
      {showImage && <ImageInsertModal uploadUrl={uploadUrl} folder={folder} onInsert={insertImage} onClose={() => setShowImage(false)} />}
    </div>
  )
}

function TB({ icon: Icon, title, onClick, active, accent, disabled }: {
  icon: React.ElementType; title: string; onClick: () => void; active?: boolean; accent?: boolean; disabled?: boolean
}) {
  return (
    <button type="button" onClick={onClick} title={title} disabled={disabled}
      className={`p-1.5 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-forest-100 text-forest-700'
        : accent ? 'text-forest-600 hover:bg-forest-50'
        : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
      }`}>
      <Icon className="w-4 h-4" />
    </button>
  )
}

function Sep() { return <div className="w-px h-5 bg-gray-200 mx-1" /> }

function ImageInsertModal({ uploadUrl, folder, onInsert, onClose }: {
  uploadUrl: string; folder: string; onInsert: (url: string, alt: string) => void; onClose: () => void
}) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-forest-600" /><h3 className="font-bold text-gray-900 text-sm">Sisipkan Gambar</h3></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Gambar</p>
            <ImagePicker value={url} onChange={setUrl} uploadUrl={uploadUrl} folder={folder} previewHeightClass="h-32" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Alt Text (deskripsi gambar)</label>
            <input type="text" value={alt} onChange={e => setAlt(e.target.value)} placeholder="Deskripsi singkat gambar untuk SEO & aksesibilitas"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-forest-400" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
          <button onClick={() => onInsert(url, alt)} disabled={!url}
            className="px-4 py-2 text-xs font-semibold bg-forest-500 text-white hover:bg-forest-600 rounded-lg transition-colors disabled:opacity-50">Sisipkan</button>
        </div>
      </div>
    </div>
  )
}
