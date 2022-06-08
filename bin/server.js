require('dotenv').config()
const express = require('express')
const PipeDrive = require('../dist/pipedrive')
const app = express()
const pd = new PipeDrive({
  logger: console,
  redirectUri: process.env.REDIRECT_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/pipedrive-oauth', async function (req, res) {
  const { code } = req.query
  await pd.authorize(code)
  await pd.refresh()
  const r = await pd.get('/v1/users/me')
    .then(d => d.data)
    .catch(console.log)
  console.log(r)
  res.send(
    `<div id='result-r'>
      ${JSON.stringify(r || 'err')}
    </div>
    <div id='token-r'>
      ${JSON.stringify(pd.token)}
    </div>
`
  )
})

app.listen(6066, '127.0.0.1', () => {
  console.log('-> server running at 127.0.0.1:6066')
  console.log('login url', pd.authorizeUri())
})
