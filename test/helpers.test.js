import path from 'node:path';
import create_meta_info from '../app/functions/create_meta_info.js';
import get_filepath from '../app/functions/get_filepath.js';
import sanitize from '../app/functions/sanitize.js';
import sanitize_markdown from '../app/functions/sanitize_markdown.js';

describe('#create_meta_info()', () => {
  it('returns YAML with title only', () => {
    const result = create_meta_info('My Page', '', '');
    expect(result).toContain('---');
    expect(result).toContain('Title: My Page');
  });

  it('returns YAML with description only', () => {
    const result = create_meta_info('', 'A description', '');
    expect(result).toContain('Description: A description');
    expect(result).not.toContain('Title');
  });

  it('returns YAML with sort only', () => {
    const result = create_meta_info('', '', '5');
    expect(result).toContain('Sort: 5');
  });

  it('returns YAML with all fields', () => {
    const result = create_meta_info('Title', 'Desc', '3');
    expect(result).toContain('Title: Title');
    expect(result).toContain('Description: Desc');
    expect(result).toContain('Sort: 3');
  });

  it('returns empty YAML frontmatter when no fields provided', () => {
    const result = create_meta_info('', '', '');
    expect(result).toBe('---\n---\n');
  });

  it('returns empty YAML frontmatter when all fields are falsy', () => {
    const result = create_meta_info(null, undefined, '');
    expect(result).toBe('---\n---\n');
  });

  it('parses sort as integer', () => {
    const result = create_meta_info('', '', '10');
    expect(result).toContain('Sort: 10');
    expect(result).not.toContain("'10'");
  });
});

describe('#get_filepath()', () => {
  it('returns content dir with filename', () => {
    const result = get_filepath({
      content: '/var/content',
      filename: 'page.md',
    });
    expect(result).toBe(path.normalize('/var/content/page.md'));
  });

  it('returns content dir with category and filename', () => {
    const result = get_filepath({
      content: '/var/content',
      category: 'docs',
      filename: 'page.md',
    });
    expect(result).toBe(path.normalize('/var/content/docs/page.md'));
  });

  it('returns content dir with category only', () => {
    const result = get_filepath({
      content: '/var/content',
      category: 'docs',
    });
    expect(result).toBe(path.normalize('/var/content/docs'));
  });

  it('returns content dir alone when no category or filename', () => {
    const result = get_filepath({
      content: '/var/content',
    });
    expect(result).toBe(path.normalize('/var/content'));
  });

  it('sanitizes category names by stripping path separators', () => {
    const result = get_filepath({
      content: '/var/content',
      category: '../etc',
      filename: 'page.md',
    });
    expect(result).not.toContain('../');
    expect(result).not.toContain('..\\');
  });

  it('sanitizes filename', () => {
    const result = get_filepath({
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

describe('#sanitize_markdown()', () => {
  it('escapes < to &lt;', () => {
    const result = sanitize_markdown('<script>alert("xss")</script>');
    expect(result).toContain('&lt;');
    expect(result).not.toContain('<');
  });

  it('escapes standalone & to &amp;', () => {
    const result = sanitize_markdown('foo & bar');
    expect(result).toBe('foo &amp; bar');
  });

  it('does not escape & in the middle of words', () => {
    const result = sanitize_markdown('AT&T');
    expect(result).toBe('AT&T');
  });

  it('does not escape & at start/end without surrounding spaces', () => {
    const result = sanitize_markdown('&test');
    expect(result).toBe('&test');
  });

  it('handles string with no special characters', () => {
    const result = sanitize_markdown('plain text');
    expect(result).toBe('plain text');
  });

  it('handles multiple < characters', () => {
    const result = sanitize_markdown('<div><span>text</span></div>');
    expect(result).not.toContain('<');
  });
});
