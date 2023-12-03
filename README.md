# Grocery list

A simple web app to handle grocery lists.

You can try the app here : https://paulgreg.me/grocery-list/ (but I strongly suggest you to host it yourself).

## Settings

Before first run, copy `src/settings.json.dist` to `src/settings.json`.

By default, data is stored in localStorage.

You can save data on a server via [json-store](https://github.com/paulgreg/json-store) project. To do so, install it on your server then update `src/settings.json` : set `saveOnline` to true, update `saveUrl` and `authorization` according json-store configuration.
