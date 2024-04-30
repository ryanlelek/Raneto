// Modules
import fs from 'node:fs';
import path from 'node:path';
import moment from 'moment';
import build_nested_pages from '../app/functions/build_nested_pages.js';
import content_processors from '../app/functions/content_processors.js';
import contents_handler from '../app/core/contents.js';
import utils from '../app/core/utils.js';

const config = {
  base_url: '',
  image_url: '/images',
  excerpt_length: 400,
  page_sort_meta: 'sort',
  category_sort: true,
  show_on_home_default: true,
  searchExtraLanguages: ['ru'],
  debug: false,
  // TODO: Fix extra trailing /
  content_dir: path.join('test', 'content') + path.sep,
  datetime_format: 'Do MMM YYYY',
};

describe('#get_last_modified()', () => {
  it('returns last modified from page meta', async () => {
    const file_path = path.join('test', 'content', 'page-with-bom-yaml.md');
    const content = fs.readFileSync(file_path, 'utf8');
    const modified = await utils.getLastModified(
      config,
      content_processors.processMeta(content),
      file_path,
    );
    expect(modified).toEqual('14th Sep 2016');
  });

  it('returns last modified from fs', async () => {
    const file_path = path.join('test', 'content', 'example-page.md');
    const content = fs.readFileSync(file_path, 'utf8');
    const modified = await utils.getLastModified(
      config,
      content_processors.processMeta(content),
      file_path,
    );
    const fstime = moment(fs.lstatSync(file_path).mtime).format(
      config.datetime_format,
    );
    expect(modified).toEqual(fstime);
  });
});

describe('#build_nested_pages()', () => {
  it('builds tree of pages', async () => {
    const pages = await contents_handler(null, config);
    const result = build_nested_pages(pages);

    expect(result.length).toEqual(2);
    expect(result[1].files.length).toEqual(3);
    expect(result[1].files[0].files[0].title).toEqual('Sub2 Page');
  });
});
