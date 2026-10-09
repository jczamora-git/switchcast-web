/**
 * Pure TypeScript safe Markdown renderer for SwitchCast Release Notes.
 * Converts GitHub-style markdown into semantic, sanitized HTML without external runtime dependencies.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(trimmed)) {
    return trimmed;
  }
  return '#';
}

function formatInline(text: string): string {
  // 1. Inline code: `code`
  let result = text.replace(/`([^`]+)`/g, (_m, code) => `<code>${escapeHtml(code)}</code>`);

  // 2. Links: [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, linkText, url) => {
    const safe = sanitizeUrl(url);
    const isExternal = safe.startsWith('http://') || safe.startsWith('https://');
    const targetRel = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${safe}"${targetRel}>${linkText}</a>`;
  });

  // 3. Bold: **text** or __text__
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // 4. Italic: *text* or _text_
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  result = result.replace(/_([^_]+)_/g, '<em>$1</em>');

  return result;
}

export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];

  let inList = false;
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  function flushList() {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  }

  function flushTable() {
    if (inTable && tableRows.length > 0) {
      html.push('<div class="table-container"><table class="release-table">');
      // First row is header
      const header = tableRows[0];
      html.push('<thead><tr>');
      header.forEach(cell => {
        html.push(`<th>${formatInline(cell)}</th>`);
      });
      html.push('</tr></thead>');

      // Body rows (skip row 1 which is delimiter like |---|---|)
      if (tableRows.length > 2) {
        html.push('<tbody>');
        for (let i = 2; i < tableRows.length; i++) {
          html.push('<tr>');
          tableRows[i].forEach(cell => {
            html.push(`<td>${formatInline(cell)}</td>`);
          });
          html.push('</tr>');
        }
        html.push('</tbody>');
      }

      html.push('</table></div>');
      inTable = false;
      tableRows = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code block toggle (```)
    if (trimmed.startsWith('```')) {
      flushList();
      flushTable();
      if (inCodeBlock) {
        html.push(`<pre class="code-block"><code>${escapeHtml(codeBlockContent.join('\n'))}</code></pre>`);
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeBlockContent = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(rawLine);
      continue;
    }

    // Horizontal Rule
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      flushTable();
      html.push('<hr class="release-divider" />');
      continue;
    }

    // Markdown Table row
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map(c => c.trim());

      // If separator line like | :--- | :--- |
      const isSeparator = cells.every(c => /^:?-+:?$/.test(c));
      if (!inTable) {
        inTable = true;
        tableRows = [cells];
      } else if (isSeparator) {
        tableRows.push(cells);
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Empty line
    if (!trimmed) {
      flushList();
      flushTable();
      continue;
    }

    // Headings
    if (trimmed.startsWith('#')) {
      flushList();
      flushTable();
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        html.push(`<h${level} class="release-heading h${level}">${formatInline(text)}</h${level}>`);
        continue;
      }
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      flushList();
      flushTable();
      const text = trimmed.replace(/^>\s?/, '');
      html.push(`<blockquote class="release-quote">${formatInline(text)}</blockquote>`);
      continue;
    }

    // Unordered List item
    if (/^[-*+]\s+/.test(trimmed)) {
      flushTable();
      if (!inList) {
        html.push('<ul class="release-list">');
        inList = true;
      }
      const itemText = trimmed.replace(/^[-*+]\s+/, '');
      html.push(`<li>${formatInline(itemText)}</li>`);
      continue;
    }

    // If we're inside a list and hit normal text
    flushList();
    flushTable();

    // Standard paragraph
    html.push(`<p class="release-p">${formatInline(trimmed)}</p>`);
  }

  flushList();
  flushTable();

  if (inCodeBlock && codeBlockContent.length > 0) {
    html.push(`<pre class="code-block"><code>${escapeHtml(codeBlockContent.join('\n'))}</code></pre>`);
  }

  return html.join('\n');
}
