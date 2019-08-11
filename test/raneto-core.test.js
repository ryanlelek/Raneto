
'use strict';

const path              = require('path');
const chai              = require('chai');
const expect            = chai.expect;
const contentProcessors = require('../app/functions/contentProcessors');

const searchHandler   = require('../app/core/search');
const pageHandler     = require('../app/core/page');
const contentsHandler = require('../app/core/contents');

chai.should();
chai.config.truncateThreshold = 0;

const config = {
  base_url: '',
  image_url: '/images',
  excerpt_length: 400,
  page_sort_meta: 'sort',
  category_sort: true,
  show_on_home_default: true,
  searchExtraLanguages: ['ru'],
  debug: false,
  content_dir: path.join(__dirname, 'content/'),
  datetime_format: 'Do MMM YYYY'
};

describe('#cleanString()', () => {

  it('converts "Hello World" into "hello-world"', () => {
    contentProcessors.cleanString('Hello World').should.equal('hello-world');
  });

  it('converts "/some/directory-example/hello/" into "some-directory-example-hello"', () => {
    contentProcessors.cleanString('/some/directory-example/hello/').should.equal('some-directory-example-hello');
  });

  it('converts "with trailing space " into "with-trailing-space"', () => {
    contentProcessors.cleanString('with trailing space ').should.equal('with-trailing-space');
  });

  it('converts "also does underscores" into "also_does_underscores"', () => {
    contentProcessors.cleanString('also does underscores', true).should.equal('also_does_underscores');
  });

  it('converts "/some/directory-example/underscores/" into "some_directory_example_underscores"', () => {
    contentProcessors.cleanString('/some/directory-example/underscores/', true).should.equal('some_directory_example_underscores');
  });

});

describe('#slugToTitle()', () => {

  it('converts "hello-world" into "Hello World"', () => {
    contentProcessors.slugToTitle('hello-world').should.equal('Hello World');
  });

  it('converts "dir/some-example-file.md" into "Some Example File"', () => {
    contentProcessors.slugToTitle('dir/some-example-file.md').should.equal('Some Example File');
  });

});

describe('#processMeta()', () => {

  it('returns array of meta values', () => {
    const result = contentProcessors.processMeta('/*\n' +
      'Title: This is a title\n' +
      'Description: This is a description\n' +
      'Sort: 4\n' +
      'Multi word: Value\n' +
      '*/\n');
    expect(result).to.have.property('title', 'This is a title');
    expect(result).to.have.property('description', 'This is a description');
    expect(result).to.have.property('sort', '4');
    expect(result).to.have.property('multi_word', 'Value');
  });

  it('returns an empty array if no meta specified', () => {
    const result = contentProcessors.processMeta('no meta here');
    /* eslint-disable no-unused-expressions */
    expect(result).to.be.empty;
  });

  it('returns proper meta from file starting with a BOM character', async () => {
    const result = await pageHandler(
      path.join(config.content_dir, 'page-with-bom.md'),
      config
    );
    expect(result).to.have.property('title', 'Example Page With BOM');
  });

  it('returns array of meta values (YAML)', () => {
    const result = contentProcessors.processMeta('---\n' +
      'Title: This is a title\n' +
      'Description: This is a description\n' +
      'Sort: 4\n' +
      'Multi word: Value\n' +
      '---\n');
    expect(result).to.have.property('title', 'This is a title');
    expect(result).to.have.property('description', 'This is a description');
    expect(result).to.have.property('sort', '4');
    expect(result).to.have.property('multi_word', 'Value');
  });

  it('returns proper meta from file starting with a BOM character (YAML)', async () => {
    const result = await pageHandler(
      path.join(config.content_dir, 'page-with-bom-yaml.md'),
      config
    );
    expect(result).to.have.property('title', 'Example Page With BOM for YAML');
  });

});

describe('#stripMeta()', () => {

  it('strips meta comment block', () => {
    const result = contentProcessors.stripMeta('/*\n' +
      'Title: This is a title\n' +
      'Description: This is a description\n' +
      'Sort: 4\n' +
      'Multi word: Value\n' +
      '*/\nThis is the content');
    result.should.equal('This is the content');
  });

  it('strips yaml meta comment block with horizontal rule in content', () => {
    const result = contentProcessors.stripMeta('---\n' +
      'Title: + This is a title\n' +
      '---\n' +
      'This is the content\n---');
    result.should.equal('This is the content\n---');
  });

  it('leaves content if no meta comment block', () => {
    const result = contentProcessors.stripMeta('This is the content');
    result.should.equal('This is the content');
  });

  it('leaves content with horizontal rule if no meta comment block', () => {
    const result = contentProcessors.stripMeta('This is the content\n---');
    result.should.equal('This is the content\n---');
  });

  it('only strips the first comment block', () => {
    const result = contentProcessors.stripMeta('/*\n' +
      'Title: This is a title\n' +
      'Description: This is a description\n' +
      'Sort: 4\n' +
      'Multi word: Value\n' +
      '*/\nThis is the content/*\n' +
      'Title: This is a title\n' +
      '*/');
    result.should.equal('This is the content/*\n' +
      'Title: This is a title\n' +
      '*/');
  });

});

describe('#processVars()', () => {

  it('replaces config vars in Markdown content', () => {
    const config = { base_url : '/base/url' };
    contentProcessors
      .processVars('This is some Markdown with a %base_url%.', config)
      .should.equal('This is some Markdown with a /base/url.');
  });

  it('replaces custom vars in Markdown content', () => {
    const config = {
      variables: [
        {
          name: 'test_variable',
          content: 'Test Variable'
        }
      ]
    };
    contentProcessors
      .processVars('This is some Markdown with a %test_variable%.', config)
      .should.equal('This is some Markdown with a Test Variable.');
  });

});

describe('#getPage()', () => {

  it('returns an array of values for a given page', async () => {
    const result = await pageHandler(
      path.join(config.content_dir, 'example-page.md'),
      config
    );
    expect(result).to.have.property('slug', 'example-page');
    expect(result).to.have.property('title', 'Example Page');
    expect(result).to.have.property('body');
    expect(result).to.have.property('excerpt');
  });

  it('returns null if no page found', async () => {
    const result = await pageHandler(
      path.join(config.content_dir, 'nonexistent-page.md'),
      config
    );
    /* eslint-disable no-unused-expressions */
    expect(result).to.be.null;
  });

});

describe('#getPages()', () => {

  it('returns an array of categories and pages', async () => {
    const result = await contentsHandler(null, config);
    expect(result[0]).to.have.property('is_index', true);
    expect(result[0].files[0]).to.have.property('title', 'Example Page');
    expect(result[1]).to.have.property('slug', 'sub');
    expect(result[1].files[0]).to.have.property('title', 'Example Sub Page');
  });

  it('marks activePageSlug as active', async () => {
    const result = await contentsHandler('/example-page', config);
    expect(result[0]).to.have.property('active', true);
    expect(result[0].files[0]).to.have.property('active', true);
    expect(result[1]).to.have.property('active', false);
    expect(result[1].files[0]).to.have.property('active', false);
  });

  it('adds show_on_home property to directory', async () => {
    const result = await contentsHandler(null, config);
    expect(result[0]).to.have.property('show_on_home', true);
  });

  it('adds show_on_home property to files', async () => {
    const result = await contentsHandler(null, config);
    expect(result[0].files[0]).to.have.property('show_on_home', true);
  });

  it('loads meta show_on_home value from directory', async () => {
    const result = await contentsHandler(null, config);
    expect(result[3]).to.have.property('show_on_home', false);
  });

  it('loads meta show_on_home value from file', async () => {
    const result = await contentsHandler(null, config);
    expect(result[0].files[4]).to.have.property('show_on_home', false);
  });

  it('applies show_on_home_default in absence of meta for directories', async () => {
    const result = await contentsHandler(null, Object.assign(config, {
      show_on_home_default: false
    }));
    expect(result[1]).to.have.property('show_on_home', false);
  });

  it('applies show_on_home_default in absence of meta for files', async () => {
    const result = await contentsHandler(null, Object.assign(config, {
      show_on_home_default: false
    }));
    expect(result[1].files[0]).to.have.property('show_on_home', false);
  });

  it('category index always shows on home', async () => {
    const result = await contentsHandler(null, Object.assign(config, {
      show_on_home_default: false
    }));
    expect(result[0]).to.have.property('show_on_home', true);
  });

});

describe('#doSearch()', () => {
  it('returns an array of search results', async () => {
    const result = await searchHandler('example', config);
    expect(result).to.have.length(5);
  });

  it('recognizes multiple languages', async () => {
    const result = await searchHandler('пример', config);
    expect(result).to.have.length(1);
  });

  it('returns an empty array if nothing found', async () => {
    const result = await searchHandler('qwerty', config);
    /* eslint-disable no-unused-expressions */
    expect(result).to.be.empty;
  });

});
