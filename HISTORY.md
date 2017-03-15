
# Raneto Changelog

2017.03.15 / v0.13.0
====================

  * **[New]** Nested Pages
    - contributed by **@zmateusz**
  * **[New]** Manual Category Title
    - contributed by **@theRealWardo**
  * **[New]** Last Edited Metadata Header
    - contributed by **@Sparticuz**
  * **[New]** Require Authentication for Viewing
    - contributed by **@bschne** and **@mohammadrafigh**
  * **[Improvement]** Meta Data RegEx Refinement
    - contributed by **@cmeyer90**
  * **[Improvement]** Unix Sitemap Generation
    - contributed by **@forsureitsme**
  * **[Improvement]** Display All Files Fix
    - contributed by **@forsureitsme**
  * **[Misc]** Code Refinements
    - **@shyim**
    - **@Sparticuz**
    - **@theRealWardo**
  * **[Misc]** Dependency upgrades

2016.09.13 / v0.11.0
====================

  * **[New]** Language Translations!
    - Mandarin Chinese contributed by **@noahvans**
    - French contributed by **@sfoubert**
    - Brazilian Portuguese contributed by **@ToasterBR**
  * **[New]** Google OAuth Support
    - contributed by **@Hitman666**
  * **[New]** Authentication for Edit (Public Read-Only)
    - contributed by **@alexspeller**
  * **[New]** Dynamic Sitemap.xml
    - contributed by **@sfoubert**
  * **[New]** Custom Variables
    - contributed by **@Sparticuz**
  * **[Improvement]** Multiple User Login
    - contributed by **@mohammadrafigh**
  * **[Improvement]** Table of Contents (Dynamic)
    - contributed by **@Sparticuz**
  * **[Misc]** Merged `Raneto-Core` module into repository
  * **[Misc]** Dependency upgrades


2016.06.18 / v0.10.1
====================

  * **[New]** Language Translations!
    - Right to Left support contributed by **@mohammadrafigh**
    - Persian contributed by **@mohammadrafigh**
  * **[New]** Docker support
    - contributed by **@prologic**
  * **[Improvement]** Better small-screen layout that automatically hides the left menu
    - contributed by **@ezaze**
  * **[Misc]** Upgrading raneto-core from v0.4.0 to v0.5.0


2016.05.22 / v0.10.0
====================

  * **[New]** Raneto Logo
    - contributed by **@mmamrila**
  * **[New]** Language Translations!
    - Russian contributed by **@iam-medvedev**
    - Turkish contributed by **@bleda**
  * **[New]** Metadata is editable
    - contributed by **@draptik**
  * **[Fixed] General BugFixes contributed by
    - **@draptik**
    - **@rogerhutchings**
    - **@dncrews**
    - **@durand**


2016.02.13 / v0.9.0
===================

  * **[Fixed]** Embedding images in content
    - contributed by **@helenamunoz**
  * **[Fixed]** Custom homepage via index.md file
    - contributed by **@dirivero**
  * **[Fixed]** Sanitizing file paths
  * **[New]** German Translation / Locale
    - contributed by **@Radiergummi**
  * **[New]** Authentication on Changes Only
    - contributed by **@Radiergummi**
  * **[New]** Vagrant Container
    - contributed by **@draptik**
  * **[New]** Category in Search Results
  * **[New]** Metadata on homepage
  * **[Upgraded]** Module raneto-core from v0.2.0 to v0.4.0
  * **[Upgraded]** Other Dependencies
  * **[Misc]** Broke up code into multiple files
  * **[Misc]** Delinted Code
  * **[Misc]** Overall refactor


2015.12.29 / v0.8.0
===================

  * **[Fixed]** URI Decoding with non-Latin characters
    - contributed by **@yaruson**
  * **[Fixed]** Windows compatability (use `npm run start_win`)
  * **[New]** Added Login Page to replace HTTP Basic Auth
    - contributed by **@matthiassb**
  * **[New]** Added ability to run Raneto as a PM2 service
    - contributed by **@matthiassb**
  * **[New]** Main Articles is now a category editable in the UI
    - contributed by **@yaruson**
  * **[New]** Using NPM for client-side libraries
    - contributed by **@sbussard**
  * **[Upgraded]** Improved Live Editor layout
    - contributed by **@draptik**
  * **[Removed]** Bower for client-side libraries
    - contributed by **@sbussard**

2015.10.11 / v0.7.1
===================

  * **[New]** Theme support. Copy `themes/default/` to `themes/<new name>/` and edit.
  * **[New]** Added toggle for enabling online editing of pages
  * **[New]** Preparing for Raneto to be NPM-installable (see example/ for new usage)
  * **[New]** Codified Bower dependencies into bower.json
  * **[Upgraded]** Upgraded Bower modules in bower.json (current)
  * **[Upgraded]** Upgraded Node.js modules in package.json (current)
  * **[Removed]** ./bin/www script. Replace with "npm start"
  * **[Removed]** Unused modules

2015.10.10 / v0.7.0
===================

  * **[New]** Added online editing of pages
    - contributed by **@matthiassb**
  * **[New]** Added HTTP Basic authentication
    - contributed by **@eighteyes**
  * **[New]** Added custom template layouts
    - contributed by **@zulfajuniadi**
  * **[Fixed]** Highlight.js language detection
    - contributed by **@thurloat**
  * **[Fixed]** Mobile design layout
    - contributed by **@adimitrov**
  * **[Fixed]** Added config.base_url in front of all assets
    - contributed by **@valeriangalliat**

2014.06.09 / v0.6.0
==========================

  * **[Changed]** Static files (e.g. images) can now be served from the content folder
  * **[Changed]** Removed commercial licensing

2014.06.05 / v0.5.0
==========================

  * **[New]** Changed app structure (now using raneto-core)
  * **[New]** Added a content_dir config option
  * **[New]** Added an analytics config option

2014.06.04 / v0.4.0
==========================

  * **[New]** Added %image_url% support to Markdown files
  * **[New]** Search queries are now highlighted in search results
  * **[Changed]** Fallback to generating title from filename if no meta title is set
  * **[Changed]** Moved route and error handlers to raneto.js
  * **[Changed]** Make search use "/" URL
  * **[Fixed]** Fixed __dirname paths in Windows

2014.06.03 / v0.3.0
==========================

  * **[New]** Added masonry layout functionality to homepage
  * **[New]** Added commercial licensing

2014.06.02 / v0.2.0
==========================

  * **[New]** Added page and category sorting functionality
  * **[Fixed]** Added better handling of file reading errors in raneto.js

2014.06.02 / v0.1.2
==========================

  * **[Changed]** Changed default copyright in config.js

2014.06.02 / v0.1.1
==========================

  * **[New]** Added favicon
  * **[Fixed]** Error page

2014.05.30 / v0.1.0
==========================

  * Initial release



*** Raneto Core Changelog ***

2015.04.22 - version 0.3.0
* [New] Add support for symlinks in content dir

2014.06.05 - version 0.2.0
* [New] Added formatting to doSearch results
* [Changed] Move config options to overridable array

2014.06.04 - version 0.1.0
 * Initial release
