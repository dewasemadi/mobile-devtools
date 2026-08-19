/**
 * Converts JSON objects or raw JSON strings into syntax-highlighted HTML string representation.
 * Uses CSS CSS variables (`--json-key`, `--json-string`, `--json-number`, `--json-boolean`, `--json-null`).
 * @param data JSON object or raw JSON string.
 * @returns HTML string with inline syntax highlighted spans.
 */
export function highlightJsonSyntax(data: any): string {
  if (data === null || data === undefined) return '';

  let jsonStr = '';
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      jsonStr = JSON.stringify(parsed, null, 2);
    } catch {
      // If plain text string, return escaped string
      return data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  } else {
    jsonStr = JSON.stringify(data, null, 2);
  }

  // Escape HTML entities
  const escaped = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Regex replacement for syntax highlighting matching CSS variables
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let colorVar = 'var(--json-number)';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          colorVar = 'var(--json-key)';
        } else {
          colorVar = 'var(--json-string)';
        }
      } else if (/true|false/.test(match)) {
        colorVar = 'var(--json-boolean)';
      } else if (/null/.test(match)) {
        colorVar = 'var(--json-null)';
      }
      return `<span style="color: ${colorVar}">${match}</span>`;
    }
  );
}
