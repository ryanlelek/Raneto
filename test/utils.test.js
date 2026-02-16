import fs from 'node:fs';
import path from 'node:path';
import moment from 'moment';
import content_processors from '../app/functions/content_processors.js';
import utils from '../app/core/utils.js';
import { createConfig } from './config-helpers.js';

const config = createConfig();

describe('#getLastModified()', () => {
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
