'use strict';

/*jshint expr: true*/

// Modules
var fs                 = require('fs');
var path               = require('path');
var chai               = require('chai');
var expect             = chai.expect;
var moment             = require('moment');
var raneto             = require('../app/core/lib/raneto.js');
var build_nested_pages = require('../app/functions/build_nested_pages.js');
var get_last_modified  = require('../app/functions/get_last_modified.js');

chai.should();
chai.config.truncateThreshold = 0;

describe('#get_last_modified()', function () {

  it('returns last modified from page meta', function () {
    raneto.config.datetime_format = 'Do MMM YYYY';
    var file_path = path.join(__dirname, 'content/page-with-bom-yaml.md');
    var content = fs.readFileSync(file_path,'utf8');
    var modified = get_last_modified(raneto.config,raneto.processMeta(content),file_path);
    expect(modified).to.be.equal('14th Sep 2016');
  });

  it('returns last modified from fs', function() {
    raneto.config.datetime_format = 'Do MMM YYYY';
    var file_path = path.join(__dirname, 'content/example-page.md');
    var content = fs.readFileSync(file_path,'utf8');
    var modified = get_last_modified(raneto.config,raneto.processMeta(content),file_path);
    var fstime = moment(fs.lstatSync(file_path).mtime).format(raneto.config.datetime_format);
    expect(modified).to.be.equal(fstime);
  });

});

describe('#build_nested_pages()', function () {

  it('builds tree of pages', function () {
    raneto.config.content_dir = path.join(__dirname, 'content/');
    var pages = raneto.getPages();
    var result = build_nested_pages(pages);

    expect(result.length).to.be.equal(2);
    expect(result[1].files.length).to.be.equal(2);
    expect(result[1].files[0].files[0].title).to.be.equal('Sub2 Page');
  });

});
