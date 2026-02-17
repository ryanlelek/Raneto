import path from 'node:path';
import createMetaInfo from '../app/functions/createMetaInfo.js';
import getFilepath from '../app/functions/getFilepath.js';
import sanitize from '../app/functions/sanitize.js';
import sanitizeMarkdown from '../app/functions/sanitizeMarkdown.js';

describe('#createMetaInfo()', () => {
  it('returns YAML with title only', () => {
    const result = createMetaInfo('My Page', '', '');
    expect(result).toContain('---');
    expect(result).toContain('Title: My Page');
  });

  it('returns YAML with description only', () => {
    const result = createMetaInfo('', 'A description', '');
    expect(result).toContain('Description: A description');
    expect(result).not.toContain('Title');
  });

  it('returns YAML with sort only', () => {
    const result = createMetaInfo('', '', '5');
    expect(result).toContain('Sort: 5');
  });

  it('returns YAML with all fields', () => {
    const result = createMetaInfo('Title', 'Desc', '3');
    expect(result).toContain('Title: Title');
    expect(result).toContain('Description: Desc');
    expect(result).toContain('Sort: 3');
  });

  it('returns empty YAML frontmatter when no fields provided', () => {
    const result = createMetaInfo('', '', '');
    expect(result).toBe('---\n---\n');
  });

  it('returns empty YAML frontmatter when all fields are falsy', () => {
    const result = createMetaInfo(null, undefined, '');
    expect(result).toBe('---\n---\n');
  });

  it('parses sort as integer', () => {
    const result = createMetaInfo('', '', '10');
    expect(result).toContain('Sort: 10');
    expect(result).not.toContain("'10'");
  });
});

describe('#getFilepath()', () => {
  it('returns content dir with filename', () => {
    const result = getFilepath({
      content: '/var/content',
      filename: 'page.md',
    });
    expect(result).toBe(path.normalize('/var/content/page.md'));
  });

  it('returns content dir with category and filename', () => {
    const result = getFilepath({
      content: '/var/content',
      category: 'docs',
      filename: 'page.md',
    });
    expect(result).toBe(path.normalize('/var/content/docs/page.md'));
  });

  it('returns content dir with category only', () => {
    const result = getFilepath({
      content: '/var/content',
      category: 'docs',
    });
    expect(result).toBe(path.normalize('/var/content/docs'));
  });

  it('returns null when no category or filename (path is content dir itself)', () => {
    const result = getFilepath({
      content: '/var/content',
    });
    expect(result).toBeNull();
  });

  it('sanitizes category names by stripping path separators', () => {
    const result = getFilepath({
      content: '/var/content',
      category: '../etc',
      filename: 'page.md',
    });
    expect(result).not.toContain('../');
    expect(result).not.toContain('..\\');
  });

  it('sanitizes filename', () => {
    const result = getFilepath({
      content: '/var/content',
      filename: '<script>.md',
    });
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });
});

describe('#sanitize()', () => {
  it('removes blacklisted characters', () => {
    const result = sanitize('hello & "world" <script>');
    expect(result).not.toContain('&');
    expect(result).not.toContain('"');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('trims whitespace', () => {
    const result = sanitize('  hello  ');
    expect(result).not.toMatch(/^\s/);
    expect(result).not.toMatch(/\s$/);
  });

  it('escapes HTML entities', () => {
    const result = sanitize('test');
    expect(typeof result).toBe('string');
  });

  it('handles empty string', () => {
    const result = sanitize('');
    expect(result).toBe('');
  });

  it('removes single quotes', () => {
    const result = sanitize("it's a test");
    expect(result).not.toContain("'");
  });

  it('removes forward slashes', () => {
    const result = sanitize('path/to/file');
    expect(result).not.toContain('/');
  });
});

describe('#sanitizeMarkdown()', () => {
  it('preserves < characters in markdown source', () => {
    const result = sanitizeMarkdown('<script>alert("xss")</script>');
    expect(result).toBe('<script>alert("xss")</script>');
  });

  it('preserves & characters in markdown source', () => {
    const result = sanitizeMarkdown('foo & bar');
    expect(result).toBe('foo & bar');
  });

  it('preserves & in the middle of words', () => {
    const result = sanitizeMarkdown('AT&T');
    expect(result).toBe('AT&T');
  });

  it('handles string with no special characters', () => {
    const result = sanitizeMarkdown('plain text');
    expect(result).toBe('plain text');
  });

  it('normalizes CRLF line endings to LF', () => {
    const result = sanitizeMarkdown('line1\r\nline2\r\nline3');
    expect(result).toBe('line1\nline2\nline3');
  });

  it('normalizes CR line endings to LF', () => {
    const result = sanitizeMarkdown('line1\rline2\rline3');
    expect(result).toBe('line1\nline2\nline3');
  });

  it('preserves HTML tags in markdown source', () => {
    const result = sanitizeMarkdown('<div><span>text</span></div>');
    expect(result).toBe('<div><span>text</span></div>');
  });
});
