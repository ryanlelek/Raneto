/*
Title: Sorting
Sort: 4
*/

By default pages and categories are sorted alphabetically. To manually sort pages and categories please
follow the instructions below.

## Sorting Pages

To manually sort pages you have to add a `Sort` item to the page meta. For example:

	/*
	Title: Sorting
	Sort: 4
	*/

The value of `Sort` should be an index integer. This page will now appear after any other pages with
a sort index of `3` or less, and before any pages with a sort index on `5` or more. If a page doesn't
have a sort index set, it will default to `0`.

You can change the meta value used for sorting by changing the `page_sort_meta` option in `config.js`.

## Sorting Categories

To manually sort categories you have to add a file called `sort` (with no extension) in the category
folder. The content of the file should simply be an index integer. Sorting will occur the same way as
it does for pages. If no `sort` file exists the category will have a sort index of `0`.

Note that top level files (i.e. files without a category) will be in an "index" category with a sort
value of `0`, so it makes sense to order your category indexes starting at `1`.

You can disable manual category sorting by setting the `category_sort` option in `config.js` to `false`.
This effectively forces the default alphabetical sorting.
