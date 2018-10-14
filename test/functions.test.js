'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

const build_nested_pages = require('../app/functions/build_nested_pages.js');
const contentProcessors = require('../app/functions/contentProcessors');

const contentsHandler = require('../app/core/contents');
const utils = require('../app/core/utils');

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

describe('#get_last_modified()', function () {

  it('returns last modified from page meta', async function () {
    const file_path = path.join(__dirname, 'content/page-with-bom-yaml.md');
    const content = fs.readFileSync(file_path, 'utf8');
    const modified = await utils.getLastModified(config, contentProcessors.processMeta(content), file_path);
    expect(modified).to.be.equal('14th Sep 2016');
  });

  it('returns last modified from fs', async function () {
    const file_path = path.join(__dirname, 'content/example-page.md');
    const content = fs.readFileSync(file_path, 'utf8');
    const modified = await utils.getLastModified(config, contentProcessors.processMeta(content), file_path);
    const fstime = moment(fs.lstatSync(file_path).mtime).format(config.datetime_format);
    expect(modified).to.be.equal(fstime);
  });

});

describe('#build_nested_pages()', function () {

  it('builds tree of pages', async function () {
    const pages = await contentsHandler(null, config);
    const result = build_nested_pages(pages);

    expect(result.length).to.be.equal(2);
    expect(result[1].files.length).to.be.equal(3);
    expect(result[1].files[0].files[0].title).to.be.equal('Sub2 Page');
  });

});
