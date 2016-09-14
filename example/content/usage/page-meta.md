Title: Meta Block
Description: This page describes how the Meta information works.
Modified: 2016-09-14T11:50:00-0500
---

Each page can contain optional meta data about the page. This is useful when you need the page to have a different
Title than the file name. The meta data will also let you override the last modified date of the page. The meta data
should be written in [YAML](http://www.yaml.org/spec/1.2/spec.html).

 * Title - This variable will override the title based on the file name.
 * Description - This variable will give lunr a description to search on.
 * Sort - This variable will affect the sorting of the pages inside the category
 * Modified - This variable will override the modified date based on the file name.
   * This should be in full ISO 8601 format including Time and Timezone offset.

Before version 0.11.0 these meta blocks could only be HTML comments (/\* \*/). Starting with version 0.11.0, the meta
blocks should be YAML blocks.
