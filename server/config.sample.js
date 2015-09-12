var config = {

  // Your site title (format: page_title - site_title)
  site_title : '顺顺文档',

  // The base URL of your site (can use %base_url% in Markdown files)
  base_url : '/',

  // Used for the "Get in touch" page footer link
  support_email : '',

  // Footer copyright content
  copyright : 'Copyright &copy; ' + new Date().getFullYear() + ' - <a href="http://www.shunshunliuxue.com">顺顺留学</a>',

  // Excerpt length (used in search)
  excerpt_length : 400,

  // The meta value by which to sort pages (value should be an integer)
  // If this option is blank pages will be sorted alphabetically
  page_sort_meta : 'sort',

  // Should categories be sorted numerically (true) or alphabetically (false)
  // If true category folders need to contain a "sort" file with an integer value
  category_sort : true,

  // The base URL of your images folder (can use %image_url% in Markdown files)
  image_url : '/images',

  // Specify the path of your content folder where all your '.md' files are located
  content_dir : './content/',

  // Add your analytics tracking code (including script tags)
  analytics : '',

  salt_factor      : 10,
  session_secret   : 'shunshun_doc',
  auth_cookie_name : 'shunshun',
  cookieMaxAge     : 1000 * 60 * 60 * 24,
  host             : 'http://wiki.shunshunliuxue.com',//'127.0.0.1:3000',
  mongodb          : {
    db      : 'mongodb://127.0.0.1/raneto_dev',
    db_name : 'raneto_dev'
  },
  mail_opts        : {
    /*service: 'smtp.qq',*/
    host : 'smtp.exmail.qq.com',
    port : 25,
    auth : {
      user : 'wenda@shunshunliuxue.com',
      pass : 'shunshun123'
    }
  }
};

module.exports = config;
