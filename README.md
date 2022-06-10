# PipeDrive API wrapper for JavaScript

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fatrox%2Fsync-dotenv%2Fbadge)](https://github.com/zxdong262/pipedrive-api-client/actions)
[![Coverage Status](https://coveralls.io/repos/github/zxdong262/pipedrive-api-client/badge.svg?branch=release)](https://coveralls.io/github/zxdong262/pipedrive-api-client?branch=release)

PipeDrive API wrapper. [api docs](https://developers.pipedrive.com/docs/api/v1).

## Installation

### Node.js

```bash
npm i pipedrive-api-client -S
```

## Usage with api token

[doc](https://pipedrive.readme.io/docs/how-to-find-the-api-token)

```js
import PipeDrive from 'pipedrive-api-client'

const pd = new PipeDrive({
  apiToken: 'xxxxxx',
  host: 'https://your-pipedrive-domain.pipedrive.com'
})

let r = await gc.get('/v1/users/me')
  .then(d => d.data)
  .catch(console.log)
expect(r.success).toBe(true)

```

## Usage with oauth

[doc](https://pipedrive.readme.io/docs/marketplace-oauth-authorization)

```js
import PipeDrive from 'pipedrive-api-client'

const pd = new PipeDrive({
  redirectUri: 'https://xxxxxx.com/oauth',
  clientId: 'xxxxxx',
  clientSecret: 'yyyyyy'
})

const loginUrl = pd.authorizeUri('some_state_string')

app.get('/oauth', (req, res) {
  const { code } = req.query
  await pd.authorize(code)
  let r = await pd.get('/v1/users/me')
    .then(d => d.data)
    .catch(console.log)
  expect(r.success).toBe(true)
})

```

Check [bin/server.js](bin/server.js) as basic example server side code.

## APIs

```js
// constructor
const pd = new PipeDrive({
  host?: string,
  apiToken?: string,
  clientId?: string,
  clientSecret?: string,
  oauthServer?: string,
  redirectUri?: string,
  appName?: string,
  appVersion?: string,
  token?: Token,
  logger?: Logger
})

// refresh token
pd.refresh()

// rest request
pg.get(url, options)
pg.delete(url, data, options)
pg.post(url, data, options)
pg.put(url, data, options)

// options: check https://axios-http.com/docs/req_config
```

## Test

```bash
cp .sample.env .env
# edit .env fill required fields
npm run test
```

## Credits

Based on [Tyler](https://github.com/tylerlong)'s [https://github.com/tylerlong/ringcentral-js-concise](https://github.com/tylerlong/ringcentral-js-concise).

## License

MIT
