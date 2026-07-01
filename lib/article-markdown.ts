// Shared markdown helpers for the article editors (admin ArticlesTab & writer dashboard).
// Single source of truth so both editors render previews identically.

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function readTime(text: string): number {
  return Math.max(1, Math.ceil(wordCount(text) / 200))
}

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function inl(s: string): string {
  return s
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:4px" />')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#f5f5f4;padding:1px 4px;border-radius:3px;font-size:0.875em">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2c4a34;text-decoration:underline">$1</a>')
}

export function parseMarkdownPreview(md: string): string {
  const lines = md.split('\n')
  const output: string[] = []
  let i = 0
  while (i < lines.length) {
    if (lines[i].includes('|') && i + 1 < lines.length && /^\|?\s*[-:]+[-|\s:]*$/.test(lines[i + 1])) {
      const hCells = lines[i].split('|').map(c => c.trim()).filter(Boolean)
      const alLine = lines[i + 1].split('|').map(c => c.trim()).filter(Boolean)
      const aligns = alLine.map(c => c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : 'left')
      let t = '<table><thead><tr>'
      hCells.forEach((c, ci) => { t += `<th style="text-align:${aligns[ci]||'left'}">${inl(esc(c))}</th>` })
      t += '</tr></thead><tbody>'
      i += 2
      while (i < lines.length && lines[i].includes('|')) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean)
        t += '<tr>'
        cells.forEach((c, ci) => { t += `<td style="text-align:${aligns[ci]||'left'}">${inl(esc(c))}</td>` })
        t += '</tr>'; i++
      }
      t += '</tbody></table>'; output.push(t); continue
    }
    const line = lines[i]
    if (line.startsWith('### ')) { output.push(`<h3>${inl(esc(line.slice(4)))}</h3>`); i++; continue }
    if (line.startsWith('## ')) { output.push(`<h2>${inl(esc(line.slice(3)))}</h2>`); i++; continue }
    if (line.startsWith('# ')) { output.push(`<h1>${inl(esc(line.slice(2)))}</h1>`); i++; continue }
    if (/^---+$/.test(line.trim())) { output.push('<hr />'); i++; continue }
    const imgM = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgM) { output.push(`<figure><img src="${esc(imgM[2])}" alt="${esc(imgM[1])}" style="max-width:100%;border-radius:8px" />${imgM[1]?`<figcaption style="text-align:center;font-size:12px;color:#a8a29e;margin-top:4px">${esc(imgM[1])}</figcaption>`:''}</figure>`); i++; continue }
    if (line.startsWith('> ')) { output.push(`<blockquote>${inl(esc(line.slice(2)))}</blockquote>`); i++; continue }
    if (/^[-*] /.test(line)) {
      let l = '<ul>'; while (i < lines.length && /^[-*] /.test(lines[i])) { l += `<li>${inl(esc(lines[i].replace(/^[-*] /, '')))}</li>`; i++ }
      l += '</ul>'; output.push(l); continue
    }
    if (/^\d+\. /.test(line)) {
      let l = '<ol>'; while (i < lines.length && /^\d+\. /.test(lines[i])) { l += `<li>${inl(esc(lines[i].replace(/^\d+\. /, '')))}</li>`; i++ }
      l += '</ol>'; output.push(l); continue
    }
    if (line.trim() === '') { i++; continue }
    let para = ''
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,3} |^[-*] |^\d+\. |^> |^---+$|^!\[/.test(lines[i]) && !(lines[i].includes('|') && i + 1 < lines.length && /^\|?\s*[-:]+[-|\s:]*$/.test(lines[i + 1]))) {
      if (para) para += ' '; para += lines[i]; i++
    }
    if (para) output.push(`<p>${inl(esc(para))}</p>`)
  }
  return output.join('\n')
}
