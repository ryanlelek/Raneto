'use strict';

const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const pageHandler     = require('../app/core/page');

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

describe('#dots_in_url()', function () {

  it('dots in filename', () => {
    const result = pageHandler(
      path.join(config.content_dir, 'file.name.with.dots.md'),
      config
    );
    expect(result).to.have.property('body', 'abcd');
  });

  it('do not allow to go up the directory tree', () => {
    const result = pageHandler(
      path.join(config.content_dir, '../dots-in-url.test.js'),
      config
    );
    expect(result).to.be.null;
  });

});
