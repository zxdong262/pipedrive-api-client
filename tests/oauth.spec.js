/* eslint-env jest */
import PipeDrive from '../src/pipedrive'
import puppeteer from 'puppeteer'

const {
  USER,
  PASS
} = process.env

const pack = require('../package.json')
jest.setTimeout(64000)

const pd = new PipeDrive({
  logger: console,
  redirectUri: process.env.REDIRECT_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

describe(pack.name, () => {
  test('basic', async () => {
    const launchOptions = {
      headless: false,
      args: ['--start-maximized']
    }
    const browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()
    await page.setViewport({ width: 1366, height: 768 })
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36')
    const url = pd.authorizeUri()
    console.log('url', url)
    await page.goto(url, {
      waitUntil: 'load', timeout: 0
    })
    const loginSel = '#login'
    const passSel = '#password'
    await page.waitForSelector('#login')
    await page.type(loginSel, USER)
    await page.type(passSel, PASS)
    await page.click('button.pb-button')
    await page.waitForSelector('button.cui5-button--variant-primary')
    await page.click('button.cui5-button--variant-primary')
    await page.waitForSelector('#result-r')
    const text = await page.$eval('#result-r', (e) => e.textContent)
    console.log(text)
    expect(text.length > 1).toBe(true)
    await pd.authorize(text.trim())
    await pd.refresh()
    const r = await pd.get('/v1/users/me')
      .then(d => d.data)
      .catch(err => {
        console.log(err.stack)
      })
    expect(r.success).toBe(true)
    const rx = await pd.revoke()
    expect(rx).toBe(true)
    expect(!pd.token.access_token).toBe(true)
    await browser.close()
  })
})
