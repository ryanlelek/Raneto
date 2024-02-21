---
Title: Category Meta
Sort: 0
---
You can add a file called meta (with no extension) in the category folder. This file must be specified in [YAML](https://yaml.org/spec/1.2.2/) and contains meta data about the category. The following meta items affect how Raneto works:

 * Title - This variable will override the title based on the folder name.
 * Sort - This variable will affect the sorting of the categories.
 * ShowOnHome - Optional. If false, category won't show on the home page. Default behavior can be changed through `config.show_on_home_default`.
 * ShowOnMenu - Optional. If false, category won't show on the site menu. Default behavior can be changed through `config.show_on_menu_default`.
 * Description - Optional. This variable will provide a variable to be used in the templates, for example in the hompage, to enhance and clarify the content of the category.

Note that `config.show_on_home_default` and `config.show_on_menu_default` will sets the default behavior for pages too.
