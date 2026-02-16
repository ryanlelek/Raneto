import { jest } from '@jest/globals';
import path from 'node:path';
import content_processors from '../app/functions/content_processors.js';
import page_handler from '../app/core/page.js';
import { createConfig } from './config-helpers.js';

const config = createConfig();

describe('#cleanString()', () => {
  it('converts "Hello World" into "hello-world"', () => {
    expect(content_processors.cleanString('Hello World')).toEqual(
      'hello-world',
    );
  });

  it('converts "/some/directory-example/hello/" into "some-directory-example-hello"', () => {
    expect(
      content_processors.cleanString('/some/directory-example/hello/'),
    ).toEqual('some-directory-example-hello');
  });

  it('converts "with trailing space " into "with-trailing-space"', () => {
    expect(content_processors.cleanString('with trailing space ')).toEqual(
      'with-trailing-space',
    );
  });

  it('converts "also does underscores" into "also_does_underscores"', () => {
    expect(
      content_processors.cleanString('also does underscores', true),
    ).toEqual('also_does_underscores');
  });

  it('converts "/some/directory-example/underscores/" into "some_directory_example_underscores"', () => {
    expect(
      content_processors.cleanString(
        '/some/directory-example/underscores/',
        true,
      ),
    ).toEqual('some_directory_example_underscores');
  });
});

describe('#slugToTitle()', () => {
  it('converts "hello-world" into "Hello World"', () => {
    expect(content_processors.slugToTitle('hello-world')).toEqual(
      'Hello World',
    );
  });

  it('converts "dir/some-example-file.md" into "Some Example File"', () => {
    expect(content_processors.slugToTitle('dir/some-example-file.md')).toEqual(
      'Some Example File',
    );
  });
});

describe('#processMeta()', () => {
  it('returns array of meta values', () => {
    // TODO: DEPRECATED Non-YAML
    const result = content_processors.processMeta(
      '/*\n' +
        'Title: This is a title\n' +
        'Description: This is a description\n' +
        'Sort: 4\n' +
        'Multi word: Value\n' +
        '*/\n',
    );
    expect(result).toHaveProperty('title', 'This is a title');
    expect(result).toHaveProperty('description', 'This is a description');
    expect(result).toHaveProperty('sort', '4');
    expect(result).toHaveProperty('multi_word', 'Value');
  });

  it('returns an empty array if no meta specified', () => {
    const result = content_processors.processMeta('no meta here');
    expect(result).toEqual({});
  });

  it('returns proper meta from file starting with a BOM character', async () => {
    const result = await page_handler(
      path.join(config.content_dir, 'page-with-bom.md'),
      config,
    );
    expect(result).toHaveProperty('title', 'Example Page With BOM');
  });

  it('returns array of meta values (YAML)', () => {
    const result = content_processors.processMeta(
      '---\n' +
        'Title: This is a title\n' +
        'Description: This is a description\n' +
        'Sort: 4\n' +
        'Multi word: Value\n' +
        '---\n',
    );
    expect(result).toHaveProperty('title', 'This is a title');
    expect(result).toHaveProperty('description', 'This is a description');
    expect(result).toHaveProperty('sort', '4');
    expect(result).toHaveProperty('multi_word', 'Value');
  });

  it('returns proper meta from file starting with a BOM character (YAML)', async () => {
    const result = await page_handler(
      path.join(config.content_dir, 'page-with-bom-yaml.md'),
      config,
    );
    expect(result).toHaveProperty('title', 'Example Page With BOM for YAML');
  });
});

describe('#stripMeta()', () => {
  it('strips meta comment block', () => {
    // TODO: DEPRECATED Non-YAML
    const result = content_processors.stripMeta(
      '/*\n' +
        'Title: This is a title\n' +
        'Description: This is a description\n' +
        'Sort: 4\n' +
        'Multi word: Value\n' +
        '*/\nThis is the content',
    );
    expect(result).toEqual('This is the content');
  });

  it('strips yaml meta comment block with horizontal rule in content', () => {
    const result = content_processors.stripMeta(
      '---\n' +
        'Title: + This is a title\n' +
        '---\n' +
        'This is the content\n---',
    );
    expect(result).toEqual('This is the content\n---');
  });

  it('leaves content if no meta comment block', () => {
    const result = content_processors.stripMeta('This is the content');
    expect(result).toEqual('This is the content');
  });

  it('leaves content with horizontal rule if no meta comment block', () => {
    const result = content_processors.stripMeta('This is the content\n---');
    expect(result).toEqual('This is the content\n---');
  });

  it('only strips the first comment block', () => {
    // TODO: DEPRECATED Non-YAML
    const result = content_processors.stripMeta(
      '/*\n' +
        'Title: This is a title\n' +
        'Description: This is a description\n' +
        'Sort: 4\n' +
        'Multi word: Value\n' +
        '*/\nThis is the content/*\n' +
        'Title: This is a title\n' +
        '/',
    );
    const expected =
      'This is the content/*\n' + 'Title: This is a title\n' + '/';
    expect(result).toEqual(expected);
  });
});

describe('#processVars()', () => {
  it('replaces config vars in Markdown content', () => {
    const config = { base_url: '/base/url' };
    const result = content_processors.processVars(
      'This is some Markdown with a %base_url%.',
      config,
    );
    expect(result).toEqual('This is some Markdown with a /base/url.');
  });

  it('replaces custom vars in Markdown content', () => {
    const config = {
      variables: [
        {
          name: 'test_variable',
          content: 'Test Variable',
        },
      ],
    };
    const result = content_processors.processVars(
      'This is some Markdown with a %test_variable%.',
      config,
    );
    expect(result).toEqual('This is some Markdown with a Test Variable.');
  });
});

describe('#extractDocument()', () => {
  const contentDir = path.join('test', 'content') + path.sep;

  it('extracts document with meta title', async () => {
    const filePath = path.join('test', 'content', 'example-page.md');
    const result = await content_processors.extractDocument(
      contentDir,
      filePath,
      false,
    );
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title', 'Example Page');
    expect(result).toHaveProperty('body');
  });

  it('falls back to slug title when no meta title', async () => {
    const filePath = path.join('test', 'content', 'special-chars.md');
    const result = await content_processors.extractDocument(
      contentDir,
      filePath,
      false,
    );
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('title');
  });

  it('returns null for nonexistent file', async () => {
    const filePath = path.join('test', 'content', 'nonexistent.md');
    const result = await content_processors.extractDocument(
      contentDir,
      filePath,
      false,
    );
    expect(result).toBeNull();
  });

  it('returns null and logs when debug is true for missing file', async () => {
    const filePath = path.join('test', 'content', 'nonexistent.md');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const result = await content_processors.extractDocument(
      contentDir,
      filePath,
      true,
    );
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('strips content_dir prefix from id', async () => {
    const filePath = path.join('test', 'content', 'example-page.md');
    const result = await content_processors.extractDocument(
      contentDir,
      filePath,
      false,
    );
    expect(result.id).not.toContain(contentDir);
    expect(result.id).toBe('example-page.md');
  });
});
