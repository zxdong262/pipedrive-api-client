/* eslint-env jest */
import PipeDrive from '../dist/pipedrive'

const pack = require('../package.json')
jest.setTimeout(64000)

const pd = new PipeDrive({
  apiToken: process.env.API_TOKEN,
  host: process.env.HOST
})

describe(pack.name, () => {
  test('basic', async () => {
    const r = await pd.get('/v1/users/me')
      .then(d => d.data)
      .catch(console.log)
    expect(r.success).toBe(true)
  })
})
