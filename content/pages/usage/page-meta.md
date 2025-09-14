---
Title: Page Meta
Description: This page describes how the Metadata works.
Modified: 2023-09-15T19:00:00-0100
---

Each page can contain optional meta data about the page. This is useful when you need the page to have a different
Title than the file name. The meta data will also let you override the last modified date of the page. The meta data
should be written in [YAML](https://yaml.org/spec/1.2.2/).

- Title - This variable will override the title based on the file name.
- Description - This variable will give `lunr` a description to search on.
- Sort - This variable will affect the sorting of the pages inside the category.
- ShowOnHome - Optional. If false, page won't be listed on the home page. Default behavior can be changed through `config.show_on_home_default`.
- ShowOnMenu - Optional. If false, page won't be listed on the site menu. Default behavior can be changed through `config.show_on_menu_default`.
- Modified - This variable will override the modified date based on the file name.
  - This should be in full ISO 8601 format including Time and Timezone offset.

Before version 0.11.0 these meta blocks could only be HTML comments (/\* \*/).
Starting with version 0.11.0, the meta blocks should be YAML blocks.
