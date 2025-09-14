// Modules
import path from 'node:path';

// Which Theme to Use?
//
// Local Directory Example (for development or custom themes)
// const theme_dir = path.join(__dirname, 'themes');
// const theme_name = 'my-theme-directory';
//
// Themes from NPM
// use "dist" as the theme name for modules (for now)
const __dirname = import.meta.dirname;
const theme_dir = path.join(
  __dirname,
  '..',
  'node_modules',
  '@raneto/theme-default',
);
const theme_name = 'dist';

const config = {
  // Your site title (format: page_title - site_title)
  site_title: 'Raneto Docs',

  // The base URL of your site (can use %base_url% in Markdown files)
  // This should be the full path to your Raneto installation:
  //   example 1: https://raneto.mydomain.com
  //   example 2: https://www.mydomain.com/raneto
  // Do not include a trailing "/"
  // Leave this as an empty string to use the default
  base_url: '',
  nowrap: true,

  // Path Prefix
  // If you are running Raneto on a subpath of your domain, add it here
  // Leave it blank if you are not sure
  //
  // Example: if you are running Raneto at http://www.mydomain.com/raneto
  //          then you would enter '/raneto' below
  path_prefix: '',

  // Used for the "Get in touch" page footer link
  support_email: '',

  // Footer Text / Copyright
  copyright: `Copyright &copy; ${new Date().getFullYear()} Raneto Team`,

  // Excerpt length (used in search)
  excerpt_length: 400,

  // The meta value by which to sort pages (value should be an integer)
  // If this option is blank pages will be sorted alphabetically
  page_sort_meta: 'sort',

  // Should categories be sorted numerically (true) or alphabetically (false)
  // If true category folders need to contain a "sort" file with an integer value
  category_sort: true,

  // Controls behavior of home page if meta ShowOnHome is not present. If set to true
  // all categories or files that do not specify ShowOnHome meta property will be shown
  show_on_home_default: true,

  // Controls behavior of the menu if meta ShowOnMenu is not present. If set to true
  // all categories or files that do not specify ShowOnMenu meta property will be shown
  show_on_menu_default: true,

  // Theme (see top of file)
  theme_dir,
  theme_name,

  // Specify the path of your content folder where all your '.md' files are located
  // Fix: Cannot be an absolute path
  content_dir: path.join(__dirname, '..', 'content', 'pages'),

  // Where is the public directory or document root?
  public_dir: path.join(theme_dir, theme_name, 'public'),

  // The base URL of your images folder,
  // Relative to config.public_dir
  // (can use %image_url% in Markdown files)
  image_url: '/images',

  // Add your analytics tracking code (including script tags)
  analytics: '',

  // Set to true to enable the web editor
  allow_editing: true,

  // Set to true to enable HTTP Basic Authentication
  authentication: true,

  // If editing is enabled, set this to true to only authenticate for editing, not for viewing
  authentication_for_edit: true,

  // If authentication is enabled, set this to true to enable authentication for reading too
  authentication_for_read: false,

  // Google OAuth
  googleoauth: false,
  google_group_restriction: {
    enabled: false,
    api_key: 'GOOGLE_API_KEY',
    group_name: 'GOOGLE_GROUP_NAME',
  },
  oauth2: {
    client_id: 'GOOGLE_CLIENT_ID',
    client_secret: 'GOOGLE_CLIENT_SECRET',
    callback: 'http://localhost:8080/auth/google/callback',
    hostedDomain: 'google.com',
  },
  secret: 'someCoolSecretRightHere',

  // ##### WARNING #####
  // You MUST change the username and password for security
  // Do NOT use "admin" as a username as it's easily guessed.
  // You are encouraged to use tools to generate a password
  // Preferably, use a local password manager
  // If you absolutely must use an online tool, here are some suggestions
  // https://bitwarden.com/password-generator/
  // https://www.grc.com/passwords.htm
  credentials: [
    {
      username: 'admin',
      password: 'password',
    },
    {
      username: 'admin2',
      password: 'password',
    },
  ],

  locale: 'en',

  // Support search with extra languages
  searchExtraLanguages: ['ru'],

  // Sets the format for datetime's
  datetime_format: 'Do MMM YYYY',

  // Set to true to render suitable layout for RTL languages
  rtl_layout: false,

  // Edit Home Page title, description, etc.
  home_meta: {
    // title       : 'Custom Home Title',
    // description : 'Custom Home Description'
  },

  // variables: [
  //   {
  //     name: 'test_variable',
  //     content: 'test variable'
  //   },
  //   {
  //     name: 'test_variable_2',
  //     content: 'test variable 2'
  //   }
  // ]

  // Set to true to enable generation of table of contents
  table_of_contents: false,

  // Configure generation of table of contents (see markdown-toc's docs for details on available options)
  table_of_contents_options: {
    // append: 'Table of contents appendix',
    // maxdepth: 6,
    // firsth1: true,
  },

  menu_on_pages: true,
  menu_on_page_collapsible: true,
};

// Exports
export default config;
