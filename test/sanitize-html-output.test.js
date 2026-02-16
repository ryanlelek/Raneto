import sanitize from '../app/functions/sanitize_html_output.js';

describe('sanitize_html_output', () => {
  it('allows standard markdown HTML tags', () => {
    const html =
      '<h1>Title</h1><p>Text with <strong>bold</strong> and <em>italic</em></p>';
    expect(sanitize(html)).toBe(html);
  });

  it('allows links with http/https', () => {
    const html = '<a href="https://example.com">link</a>';
    expect(sanitize(html)).toBe(html);
  });

  it('allows images', () => {
    const html = '<img src="photo.jpg" alt="A photo" title="Photo" />';
    expect(sanitize(html)).toContain('src="photo.jpg"');
    expect(sanitize(html)).toContain('alt="A photo"');
  });

  it('allows task list checkboxes', () => {
    const html = '<input type="checkbox" checked="" disabled="" />';
    const result = sanitize(html);
    expect(result).toContain('type="checkbox"');
    expect(result).toContain('disabled');
  });

  it('allows heading id attributes from gfmHeadingId', () => {
    const html = '<h2 id="my-heading">My Heading</h2>';
    expect(sanitize(html)).toBe(html);
  });

  it('allows code blocks with class for syntax highlighting', () => {
    const html = '<pre><code class="language-js">const x = 1;</code></pre>';
    expect(sanitize(html)).toBe(html);
  });

  it('allows span with class for search highlighting', () => {
    const html = '<span class="search-query">term</span>';
    expect(sanitize(html)).toBe(html);
  });

  it('allows tables', () => {
    const html =
      '<table><thead><tr><th>Col</th></tr></thead><tbody><tr><td>Val</td></tr></tbody></table>';
    expect(sanitize(html)).toBe(html);
  });

  it('allows del for strikethrough', () => {
    const html = '<del>removed</del>';
    expect(sanitize(html)).toBe(html);
  });

  it('strips script tags', () => {
    const html = '<p>Hello</p><script>alert("xss")</script>';
    expect(sanitize(html)).toBe('<p>Hello</p>');
  });

  it('strips javascript: protocol from links', () => {
    const html = '<a href="javascript:alert(1)">click</a>';
    const result = sanitize(html);
    expect(result).not.toContain('javascript:');
  });

  it('strips event handler attributes', () => {
    const html = '<img src="x" onerror="alert(1)" />';
    const result = sanitize(html);
    expect(result).not.toContain('onerror');
  });

  it('strips iframe tags', () => {
    const html = '<iframe src="https://evil.com"></iframe>';
    expect(sanitize(html)).toBe('');
  });

  it('strips style tags', () => {
    const html = '<style>body { display: none; }</style><p>Text</p>';
    expect(sanitize(html)).toBe('<p>Text</p>');
  });

  it('strips form tags', () => {
    const html = '<form action="https://evil.com"><input type="text" /></form>';
    const result = sanitize(html);
    expect(result).not.toContain('<form');
  });

  it('strips object and embed tags', () => {
    const html =
      '<object data="evil.swf"></object><embed src="evil.swf"></embed>';
    expect(sanitize(html)).toBe('');
  });

  it('strips data: protocol from image src', () => {
    const html =
      '<img src="data:text/html,<script>alert(1)</script>" alt="xss" />';
    const result = sanitize(html);
    expect(result).not.toContain('data:');
  });

  it('strips onclick from links', () => {
    const html = '<a href="#" onclick="alert(1)">click</a>';
    const result = sanitize(html);
    expect(result).not.toContain('onclick');
  });

  it('preserves content inside stripped tags', () => {
    const html = '<div><script>alert(1)</script>Safe text</div>';
    expect(sanitize(html)).toContain('Safe text');
  });
});
