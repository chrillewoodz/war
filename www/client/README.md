# After cloning repository

- `$ npm install`

# Development

Run the following in 3 separate terminal tabs while standing at the project root:

- `$ ng build shared --watch`
- `$ ng serve` (might have to wait for shared to finish building when first starting it)
- `$ cd server && npm run dev`

# TODOS:

- Each client should authenticate to the server using a JWT to only accept trusted connections and to avoid others using the same server. On every incoming emit from the client, validate the JWT before continuing to the actual event callback on the server, i.e. the `onHost`, `onJoin` etc.