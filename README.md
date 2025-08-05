# Grocery list

A [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) grocery-list web app using [YJS](https://docs.yjs.dev/).

You can try the app here : https://paulgreg.me/grocery-list/ but with local storage only.

It is designed to be used with [paulgreg/y-websocket-service](https://github.com/paulgreg/y-websocket-service) for client synchronisation.

## Configuration

Before first run, copy `src/settings.json.dist` to `src/settings.json` and change settings to use CRDT server.
