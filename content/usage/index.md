/*
Title: Index pages
Sort: 5
*/

Any page with name `index.md` will be served from folder address.

This means that, when a folder named `example/` has an `index.md` file under it, to access that page you just need request `http://localhost:3000/example/` instead of `http://localhost:3000/example/index`.

Links for these pages are parsed withoud the `index` suffix.