---
Title: Customizing the Template
---

Templating in Raneto is powered by [Mustache](https://mustache.github.io/). 

Feel free to customize the template as you wish. The template structure is as follows:

- `layout.html`: The parent template. You'll probably want to customize this first
- `home.html`: The homepage template. Shown if you don't have an [index.md](%base_url%/usage/custom-homepage)
- `page.html`: The template used for single pages
- `search.html`: The template used for search results
- `error.html`: Shown when Raneto encounters an error or can't find a page

Remember you will need to restart the app after changing the template.

## Previous way of installing a custom theme

Templates can either be put in the application directory under `config.theme_dir` (which you can set to `/themes` for example). You choose the theme you wish with `config.theme_name` that corresponds to the sub-folder in the `config.theme_dir`.

## New, better way of installing a custom theme

The default theme is available under `@raneto/theme-default` on <https://github.com/raneto/theme-default>. 

- Fork this module: https://github.com/raneto/theme-default
- Publish your package with changes, whether public on GitHub or using a private NPM registry
- install the module with npm install mytheme or similar `npm install @me/my-raneto-theme`
- update the config file with your theme module name

## Enable Features on Pages by Altering Config Settings

Some features can be enabled on your pages by changing settings in the `config.default.js` file.

### Enable Table of Contents

In `config.default.js` set `table_of_contents` to `true`. Raneto uses
[markdown-toc](https://github.com/jonschlinkert/markdown-toc) to generate
the table of contents on pages, so you can customize the appearance of the
tables of contents by specifying values for parameters in
the `table_of_contents_options` object in `config.default.js`.

### Display Site Menu on Pages

In `config.default.js` set `menu_on_pages` to `true`.  
To make the menu collapsible, so that category headings can be expanded or collapsed -
useful for sites with lots of pages - set `menu_on_pages_collapsible` to `true`.

## Public Files

All static files in Raneto (images, CSS, JavaScript files, etc.) are served from the `public` folder.  
This is so that no one can access any other files in the install.  
Only files in the `public` folder are available to visitors that are not logged in.

It's worth noting that when customising Raneto you should always make your
own files rather than customizing the existing Raneto files,
so that your changes don't get lost when you [update Raneto](%base_url%/updates/updating-raneto).

## Template Variables

Below are a list of template variables available to use in their respective templates:

**home.html**

- `config`: Holds an array of values from `config.js`
- `pages`: Structured list of categories and pages (used for navigation)
- `body_class`: Class for the `<body>` tag

**page.html**

- `config`: Holds an array of values from `config.js`
- `pages`: Structured list of categories and pages (used for navigation)
- `body_class`: Class for the `<body>` tag
- `meta`: Holds an array of values taken from the page meta comment block (e.g. `meta.title`)
- `content`: The HTML content of the page
- `last_modified`: The formatted date of the time the file was last modified

**search.html**

- `config`: Holds an array of values from `config.js`
- `pages`: Structured list of categories and pages (used for navigation)
- `body_class`: Class for the `<body>` tag
- `search`: The current search query
- `searchResults`: An array search results

## Array Structure

The `pages` array has a structure similar to the following:

- `slug`: The category slug
- `title`: The category title
- `is_index`: True for the top level files (ie not in a category)
- `class`: CSS class
- `sort`: The sort index for this category
- `files[]`: Array of pages in this category
- `slug`: The page slug
- `title`: The page title
- `active`: True if the current page is "active"
- `sort`: The sort index for this page

The `searchResults` array contains items which include:

- `slug`: The page slug
- `title`: The page title
- `body`: The page content
- `excerpt`: The page excerpt
