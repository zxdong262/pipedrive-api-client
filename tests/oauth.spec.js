/* eslint-env jest */
import PipeDrive from '../dist/pipedrive'
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
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
    const url = pd.authorizeUri()
    await page.goto(url, {
      waitUntil: 'load', timeout: 0
    })
    const loginSel = '#login'
    const passSel = '#password'
    await page.waitFor(() => {
      const srcSelector = '#login'
      return document.querySelectorAll(srcSelector).length
    })
    console.log('user', USER)
    console.log('pass', PASS)
    await page.waitFor(3000)
    await page.type(loginSel, USER)
    await page.type(passSel, PASS)
    await page.click('button.pb-button')
    await page.waitFor(() => {
      const srcSelector = 'button.cui5-button--variant-primary'
      return document.querySelectorAll(srcSelector).length
    })
    await page.click('button.cui5-button--variant-primary')
    await page.waitFor(() => {
      const srcSelector = '#result-r'
      return document.querySelectorAll(srcSelector).length
    })
    const text = await page.$eval('#result-r', (e) => e.textContent)
    console.log(text)
    expect(text.includes(USER)).toBe(true)
    const token = await page.$eval('#token-r', (e) => e.textContent)
    pd.token = JSON.parse(token)
    await pd.refresh()
    const r = await pd.get('/v1/users/me')
      .then(d => d.data)
      .catch(console.log)
    expect(r.success).toBe(true)
    await browser.close()
  })
})
