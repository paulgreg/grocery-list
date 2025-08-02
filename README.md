# Grocery list

A [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) grocery-list web app using [YJS](https://docs.yjs.dev/).

You can try the app here : https://paulgreg.me/grocery-list/ but with local storage only.

It is designed to be used with [y-websocket](https://www.npmjs.com/package/y-websocket).

I’ve made a launcher project here : [paulgreg/yjs-server](https://github.com/paulgreg/yjs-server)

## Settings

Before first run, copy `src/settings.json.dist` to `src/settings.json`.

By default, data is stored in localStorage.

You can save data on a server via [json-store](https://github.com/paulgreg/json-store) project. To do so, install it on your server then update `src/settings.json` : set `saveOnline` to true, update `saveUrl` and `authorization` according json-store configuration.
