# PipeDrive API wrapper for JavaScript

PipeDrive API wrapper. [api docs](https://developers.pipedrive.com/docs/api/v1).

## Installation

### Node.js

```bash
npm i pipedrive-api-client -S
```

## Usage with api token

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
  let r = await gc.get('/v1/users/me')
    .then(d => d.data)
    .catch(console.log)
  expect(r.success).toBe(true)
})

```

Check [bin/server.js](bin/server.js) as basic example server side code

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
