import path from 'node:path';

export function createConfig(overrides = {}) {
  return {
    base_url: '',
    image_url: '/images',
    excerpt_length: 400,
    page_sort_meta: 'sort',
    category_sort: true,
    show_on_home_default: true,
    show_on_menu_default: true,
    searchExtraLanguages: ['ru'],
    debug: false,
    content_dir: path.join('test', 'content') + path.sep,
    datetime_format: 'Do MMM YYYY',
    ...overrides,
  };
}
