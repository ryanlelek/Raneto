import path from 'node:path';
import content_processors from '../app/functions/content_processors.js';
import search_handler from '../app/core/search.js';
import page_handler from '../app/core/page.js';
import contents_handler from '../app/core/contents.js';

const config = {
  base_url: '',
  image_url: '/images',
  excerpt_length: 400,
  page_sort_meta: 'sort',
  category_sort: true,
  show_on_home_default: true,
  show_on_menu_default: true,
  searchExtraLanguages: ['ru'],
  debug: false,
  // TODO: Fix extra trailing /
  content_dir: path.join('test', 'content') + path.sep,
  datetime_format: 'Do MMM YYYY',
};

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

describe('#getPage()', () => {
  it('returns an array of values for a given page', async () => {
    const result = await page_handler(
      path.join(config.content_dir, 'example-page.md'),
      config,
    );
    expect(result).toHaveProperty('slug', 'example-page');
    expect(result).toHaveProperty('title', 'Example Page');
    expect(result).toHaveProperty('body');
    expect(result).toHaveProperty('excerpt');
  });

  it('returns null if no page found', async () => {
    const result = await page_handler(
      path.join(config.content_dir, 'nonexistent-page.md'),
      config,
    );
    expect(result).toBeNull();
  });
});

describe('#getPages()', () => {
  it('returns an array of categories and pages', async () => {
    const result = await contents_handler(null, config);
    expect(result[0]).toHaveProperty('is_index', true);
    expect(result[0].files[0]).toHaveProperty(
      'title',
      'Special Characters Page',
    );
    expect(result[1]).toHaveProperty('slug', 'sub');
    expect(result[1].files[0]).toHaveProperty('title', 'Example Sub Page');
  });

  it('marks activePageSlug as active', async () => {
    const result = await contents_handler('/special-chars', config);
    expect(result[0]).toHaveProperty('active', true);
    expect(result[0].files[0]).toHaveProperty('active', true);
    expect(result[1]).toHaveProperty('active', false);
    expect(result[1].files[0]).toHaveProperty('active', false);
  });

  it('adds show_on_home property to directory', async () => {
    const result = await contents_handler(null, config);
    expect(result[0]).toHaveProperty('show_on_home', true);
  });

  it('adds show_on_home property to files', async () => {
    const result = await contents_handler(null, config);
    expect(result[0].files[0]).toHaveProperty('show_on_home', true);
  });

  it('loads meta show_on_home value from directory', async () => {
    const result = await contents_handler(null, config);
    expect(result[3]).toHaveProperty('show_on_home', false);
  });

  it('loads meta show_on_home value from file', async () => {
    const result = await contents_handler(null, config);
    expect(result[0].files[4]).toHaveProperty('show_on_home', false);
  });

  it('applies show_on_home_default in absence of meta for directories', async () => {
    const result = await contents_handler(
      null,
      // TODO: Update
      Object.assign(config, {
        show_on_home_default: false,
      }),
    );
    expect(result[1]).toHaveProperty('show_on_home', false);
  });

  it('applies show_on_home_default in absence of meta for files', async () => {
    const result = await contents_handler(
      null,
      // TODO: Update
      Object.assign(config, {
        show_on_home_default: false,
      }),
    );
    expect(result[1].files[0]).toHaveProperty('show_on_home', false);
  });

  it('category index always shows on home', async () => {
    const result = await contents_handler(
      null,
      // TODO: Update
      Object.assign(config, {
        show_on_home_default: false,
      }),
    );
    expect(result[0]).toHaveProperty('show_on_home', true);
  });

  it('adds show_on_menu property to directory', async () => {
    const result = await contents_handler(null, config);
    expect(result[0]).toHaveProperty('show_on_menu', true);
  });

  it('adds show_on_menu property to files', async () => {
    const result = await contents_handler(null, config);
    expect(result[0].files[0]).toHaveProperty('show_on_menu', true);
  });

  it('loads meta show_on_menu value from directory', async () => {
    const result = await contents_handler(null, config);
    expect(result[3]).toHaveProperty('show_on_menu', false);
  });

  it('loads meta show_on_menu value from file', async () => {
    const result = await contents_handler(null, config);
    expect(result[0].files[4]).toHaveProperty('show_on_menu', false);
  });

  it('applies show_on_menu_default in absence of meta for directories', async () => {
    const result = await contents_handler(
      null,
      // TODO: Update
      Object.assign(config, {
        show_on_menu_default: false,
      }),
    );
    expect(result[1]).toHaveProperty('show_on_menu', false);
  });

  it('applies show_on_menu_default in absence of meta for files', async () => {
    const result = await contents_handler(
      null,
      // TODO: Update
      Object.assign(config, {
        show_on_menu_default: false,
      }),
    );
    expect(result[1].files[0]).toHaveProperty('show_on_menu', false);
  });

  it('category main always shows on menu', async () => {
    const result = await contents_handler(
      null,
      // TODO: Update
      Object.assign(config, {
        show_on_menu_default: false,
      }),
    );
    expect(result[0]).toHaveProperty('show_on_menu', true);
  });
});

describe('#doSearch()', () => {
  xit('returns an array of search results', async () => {
    const result = await search_handler('example', config);
    expect(result).toHaveLength(5);
  });

  xit('recognizes multiple languages', async () => {
    const result = await search_handler('пример', config);
    expect(result).toHaveLength(1);
  });

  it('returns an empty array if nothing found', async () => {
    const result = await search_handler('qwerty', config);
    expect(result).toEqual([]);
  });
});
