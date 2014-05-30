/*
Title: Creating Pages
*/

Creating pages in Raneto is as simple as creating a Markdown file (`.md`) with you favourite text editor.
There are several important aspects to your files that you need to pay attention to when you create pages.

## File Location

All of your Markdown files must go in the `content` folder in the root of the application. You can add as
many sub-folders as you like in the content folder, but only `.md` files within the `content` folder
(or sub-folders) will be recognised.

You can use sub-folders as a way of creating "categories" of pages. For example if you create a sub-folder
called `using-my-product` all of the pages inside that folder will appear under the **Using My Product**
category in Raneto. You can create as many levels of sub-folder as you like but they will always appear
as a top level category.

Sub-folders will also be added to the page URL or "slug". See file naming below for more information.

## File Name

The name of the file defines what URL or "slug" is used to navigate to that page. For example if you create
a file called `my-example-page.md` you would visit that page be navigation to `example.com/my-example-page`.
Below is a table of example folder and file names and the URL's they would have in Raneto.

File Location | URL
------------- | -------------
`content/hello.md` | `/hello`
`content/my-example-page.md` | `/my-example-page`
`content/hello/my-example-page.md` | `/hello/my-example-page`
`content/some/sub/folder/page.md` | `/some/sub/folder/page`

If a file cannot be found the `error.html` template will be shown.

## File Markup

Pages are created using Markdown. If you are new to Markdown please refer to the
[syntax guide](http://daringfireball.net/projects/markdown/syntax) for more information. Pages can also
contain regular HTML.

At the top of a page you must place a block comment to specify certain attributes of the page. For the
moment only a title is required but you can also add a description which will be used by search engines.

	/*
	Title: My Page Title
	Description: Optional description for search engines
	*/

You can also use the *&#37;base_url&#37;* variable in your Markdown pages which will be replaced with the base URL
you set in [your config](%base_url%/usage/configuration).
