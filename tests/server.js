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
  res.send(
    `<div id='result-r'>
      ${code}
    </div>
`
  )
})

app.listen(6066, '127.0.0.1', () => {
  console.log('-> server running at 127.0.0.1:6066')
  console.log('login url', pd.authorizeUri())
})
