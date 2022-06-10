/* eslint-env jest */
import PipeDrive from '../src/pipedrive'

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
    const name = 'test contact'
    const contact = await pd.post('/v1/persons', {
      name
    }).then(d => d.data)
    expect(contact.data.name).toBe(name)
    const newName = 'new name'
    const u = await pd.put('/v1/persons/' + contact.data.id, {
      name: newName
    }).then(d => d.data)
    expect(u.data.name).toBe(newName)
    const d = await pd.delete(pd.host + '/v1/persons/' + contact.data.id + '?xx=xx').then(d => d.data)
    expect(d.data.id).toBe(contact.data.id)

    const xx = await pd.get('/v1/users/mexxx?xx=ff')
      .catch(err => {
        console.log(err)
        return 'error'
      })
    expect(xx).toBe('error')
  })
})
