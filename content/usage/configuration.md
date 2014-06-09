/*
Title: Configuration
Sort: 1
*/

To edit the configuration of Raneto you need to edit `config.js` in the root directory.
It should contain config variables like:

```
// Your site title (format: page_title - site_title)
site_title: 'Example Site',
// The base URL of your site (can use %base_url% in Markdown files)
base_url: '',
// Used for the "Get in touch" page footer link
support_email: 'support@example.com',
// Footer copyright content
copyright: 'Copyright &copy; Example Site',
// Excerpt length (used in search)
excerpt_length: 400
// ...
```

Feel free to edit these variables as you wish. Each variable comes with an explanation as to what it does.
Remember you will need to restart the app after changing config variables.

If you are editing the template you can add custom variables here and they will become availble in the
template via the `config` variable (e.g. `{{config.myvar}}`)
