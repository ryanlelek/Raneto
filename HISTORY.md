
# Raneto Changelog

2024.02.21 / v0.17.7
====================
  * **[Fix]** Markdown content parser/sanitization (https://github.com/ryanlelek/Raneto/commit/863aaf5095010e1013715e16e4fd474166c2591a)
  * **[Misc]** Dependency upgrades (https://github.com/ryanlelek/Raneto/commit/ed4f09780539644ac82b7767f911a061c7395d40)

2023.11.05 / v0.17.6
====================
  * **[Misc]** Dependency upgrades

2023.06.20 / v0.17.5
====================
  * **[Misc]** Dependency upgrades

2023.04.11 / v0.17.3
=======
* **[New]** Linter Updates
-- https://github.com/ryanlelek/Raneto/commit/dddade7e5b8f49f8ec9171265d2201bfad11fa50 (ESLint 1)
-- https://github.com/ryanlelek/Raneto/commit/563756816957f7389fe7d615604f2f486f9155e5 (ESLint 2)
-- https://github.com/ryanlelek/Raneto/commit/878e95b3a0a7398d9e7baf708398745ffcca44a8 (Prettier)
* **[Fix]** Commander/PM2 (Unsupported)
-- https://github.com/ryanlelek/Raneto/commit/19605c228353d2971bd6fbb126a24b696f085851
* **[Misc]** Dependency upgrades
-- Packages current as of today (exception: `glob`)
-- https://github.com/ryanlelek/Raneto/commit/66e08c615eec2fa141ea5512f94f21167e00036d (Container Image)
-- https://github.com/ryanlelek/Raneto/commit/bf6d33ec9f2c9ac31c144155b00091d56e020f6a (NPM Packages)
* Extract `themes/` to new repository/package [@raneto/theme-default](https://github.com/raneto/theme-default)
* Extract `example/` to new [repository](https://github.com/raneto/example)
* **[Removed]** Package `gulp-shell`
* **[Removed]** Package `markdown-it`

2022.08.28 / v0.17.2
====================
* **[Fix]** Crash for ignored directories by @pmoleri #369
* **[Docs]** Updated, first pass
* **[Misc]** Pipelines fixed after Travis CI shutdown
* **[Misc]** Dependency upgrades
-- Packages current as of today (exception: bootstrap)

2022.08.02 / v0.17.1
====================
# IMPORTANT - SECURITY FIXES

* **[SECURITY]** Sanitization, DoS, Best Practices by @J-GainSec #368
-- Mitigation @ryanlelek #370
* **[New]** Finnish Translation by @Mixerboy24 #363  Oksanen / LocalghostFI Ltd
* **[Fix]** Redirect Fix on server restart, suggested by @leofranke95 #340
* **[Fix]** Docker image build process by @jj-style #355
* **[Fix]** Top bar navigation by @norogoth #357 #358
* **[Fix]** Add Page to Current Category @Meiwer #364

2021.03.28 / v0.17.0
====================
Possible breaking changes, based on your implementation
* **[Edit]** Listening on `127.0.0.1` instead of all interfaces #345

2021.02.04 / v0.16.6
====================

* **[Fix]** Example configuration file #338
  - contributed by **@ryanlelek**

2020.12.25 / v0.16.5
====================

* **[New]** Swedish translation
  - contributed by **@Synt3x**
* **[New]** Japanese translation
  - contributed by **@filunK**
* **[New]** Add table of contents
  - contributed by **@benruehl**
* **[New]** Added side menu collapsing functionality
  - contributed by **@philipstratford**
* **[New]** Visibility of menu on pages toggle
  - contributed by **@philipstratford**
* **[New]** Google groups restriction
  - contributed by **@Axadiw**
* **[New]** Category meta description
  - contributed by **@marcello.gorla**

* **[Doc]** TOC and site menu on pages
  - contributed by **@philipstratford**
* **[Doc]** Updated install, guide, and README pages
  - contributed by **@Arthur Flageul**

* **[Fix]** Fixed bug highlighting of second-level page titles
  - contributed by **@philipstratford**
* **[Fix]** #189 base_url config
  - contributed by **@ryanlelek**
* **[Fix]** Side menu visibility
  - contributed by **@Synt3x**
* **[Fix]** lunr-languages/tinyseg instead of tiny-segmenter
  - contributed by **@filunK**
* **[Fix]** Travis, Yarn, NPM, etc.
  - contributed by **@filunK**
* **[Fix]** wrong fitvids js location
  - contributed by **@jrichardsz**

2019.08.11 / v0.16.4
====================

  * **[New]** Async IO Improvements #294
    - contributed by **@pmoleri**
  * **[New]** Danish Translation #292
    - contributed by **@MortenHC**
  * **[Fixed]** Heroku postinstall script #291
    - contributed by **@shamork**
  * **[Fixed]** Code fixes for upgraded dependencies
    - contributed by **@ryanlelek**
  * **[Misc]** Dependency upgrades

2019.01.19 / v0.16.2
====================

  * **[New]** Polish Translation
    - contributed by **@suprovsky - Radosław Serba**
  * **[Fixed]** base_url ignored on login page #200
    - contributed by **@GrahamDumpleton**
  * **[Fixed]** Request for translations.json doesn't include base_url #279
    - contributed by **@GrahamDumpleton**
  * **[Fixed]** Proxy subfolders #189
    - contributed by **@GrahamDumpleton**
  * **[Misc]** Dependency upgrades

2018.04.21 / v0.16.0
====================

  * **[New]** Better Multi-Language Support!
    - contributed by **@Orhideous**
  * **[New]** Raneto can be served from non-root path (URI Prefix)
    - contributed by **@gugu**
  * **[Misc]** Upgrade to lunr v2.x
    - contributed by **@Orhideous**
  * **[Misc]** Code Refactor
    - contributed by **@Orhideous**
  * **[Misc]** Dependency upgrades

2018.03.29 / v0.15.0
====================

  * **[New]** Language Translations!
    - Romanian contributed by **@mariuspana**
  * **[Fixed]** #192 Any metadata will now cause metadata to render
    - **@mralexgray**
  * **[Fixed]** Login page loading of jQuery Backstretch plugin
    - **@Zezzty**
  * **[Fixed]** #247 Search result page no longer shows excerpt as link text
    - **@Zezzty**
  * **[Fixed]** #251 #194 Documentation in README for local install
    - **@shui**
  * **[Misc]** Dependency upgrades

2018.01.09 / v0.14.0
====================

  * **[New]** Language Translations!
    - Spanish contributed by **@dgarcia202**
    - Norwegian contributed by **@kek91**
    - Hungarian contributed by **@gabord**
  * **[New]** Multi-level Page Nesting
    - **@denisvmedia**
  * **[New]** Marking Active Category in UI
    - **@pmoleri**
  * **[New]** Export of Raneto class
    - **@pmoleri**
  * **[Improvement]** Search with Special Characters
    - **@cassiobsilva**
  * **[Improvement]** Upgrade to SweetAlert2
    - **@limonte**
  * **[Misc]** Remove Babel
    - **@pmoleri**
  * **[Misc]** Move from JSHint to ESLint
    - **@Sparticuz**
  * **[Misc]** Code Refinements
    - **@furier**
    - **@dettoni**
    - **@denisvmedia**
    - **@dgarcia202**
  * **[Misc]** Document Refinements
    - **@dgarcia202**
    - **@n7st**
  * **[Misc]** Dependency upgrades

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
