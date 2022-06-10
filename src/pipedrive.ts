// based on tyler's work: https://github.com/tylerlong/ringcentral-js-concise
import axios, { AxiosInstance } from 'axios'
import { Config, Data, Options, Token, Logger } from './types'

const version = process.env.version

export class HTTPError extends Error {
  status: number
  statusText: string
  data: Data
  config: Config
  constructor (status: number, statusText: string, data: Data, config: Config) {
    super(`status: ${status}
statusText: ${statusText}
data: ${JSON.stringify(data, null, 2)}
config: ${JSON.stringify(config, null, 2)}`)
    this.status = status
    this.statusText = statusText
    this.data = data
    this.config = config
  }
}

class PipeDriveClient {
  token: Token
  oauthServer: string
  appName: string
  version: string | undefined
  appVersion: string
  _axios: AxiosInstance
  userAgentHeader: string
  logger?: Logger
  host?: string
  apiToken?: string
  redirectUri?: string
  refreshRequest?: any
  clientId?: string
  clientSecret?: string

  static oauthServer = 'https://oauth.pipedrive.com'

  constructor (options: Options) {
    this.logger = options.logger
    this.host = options.host
    this.apiToken = options.apiToken
    this.redirectUri = options.redirectUri
    this.token = options.token || {}
    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
    this.oauthServer = options.oauthServer || PipeDriveClient.oauthServer
    this.appName = options.appName || 'Unknown'
    this.appVersion = options.appVersion || 'v0.0.1'
    this.version = version
    this.userAgentHeader = `${this.appName}/${this.appVersion} pipedrive-api-client/${version}`

    this._axios = axios.create()
    const request = this._axios.request.bind(this._axios)
    this._axios.request = (config) => {
      try {
        return request(config)
      } catch (e: any) {
        if (e.response) {
          throw new HTTPError(e.response.status, e.response.statusText, e.response.data, e.response.config)
        } else {
          throw e
        }
      }
    }
  }

  request (config: Config) {
    let url = config.url.startsWith('http')
      ? config.url
      : (
        this.apiToken
          ? this.host + '/api' + config.url
          : this.token.api_domain + config.url
      )
    if (this.apiToken) {
      const sep = url.includes('?')
        ? '&'
        : '?'
      const q = sep + 'api_token=' + this.apiToken
      url = url + q
    }
    this.log('request url', url)
    const headers = this._patchHeaders(config.headers)
    this.log('request headers', headers)
    return this._axios.request({
      ...config,
      url,
      headers
    })
  }

  log (...logs: any[]) {
    if (this.logger) {
      this.logger.log(...logs)
    }
  }

  authorizeUri (state: string = '') {
    return this.oauthServer +
      `/oauth/authorize?client_id=${this.clientId}&state=${state}` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri || '')}`
  }

  oauthUrl () {
    return `${this.oauthServer}/oauth/token`
  }

  async authorize (code: string) {
    const data = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(this.redirectUri || '')}`
    const url = this.oauthUrl()
    this.log('oauth url', url)
    const r = await this._axios.request({
      method: 'post',
      url,
      data,
      headers: this._basicAuthorizationHeader()
    }).then(r => r.data)
    Object.assign(
      this.token,
      r
    )
  }

  async refresh () {
    if (!this.token.refresh_token) {
      return
    }
    if (!this.refreshRequest) {
      const data = `grant_type=refresh_token&refresh_token=${this.token.refresh_token}`
      this.refreshRequest = this._axios.request({
        method: 'post',
        url: this.oauthUrl(),
        data,
        headers: this._basicAuthorizationHeader()
      }).then(r => r.data)
    }
    const r = await this.refreshRequest
    Object.assign(
      this.token,
      r
    )
    this.refreshRequest = undefined
  }

  get (url: string, config = {}) {
    return this.request({ ...config, method: 'get', url })
  }

  delete (url: string, config = {}) {
    return this.request({ ...config, method: 'delete', url })
  }

  post (url: string, data = undefined, config = {}) {
    return this.request({ ...config, method: 'post', url, data })
  }

  put (url: string, data = undefined, config = {}) {
    return this.request({ ...config, method: 'put', url, data })
  }

  patch (url: string, data = undefined, config = {}) {
    return this.request({ ...config, method: 'patch', url, data })
  }

  _patchHeaders (headers: Data = {}) {
    return {
      'Content-Type': 'application/json',
      ...this._authHeader(),
      'X-User-Agent': this.userAgentHeader,
      ...headers,
      ...this._authHeader()
    }
  }

  _authHeader () {
    return this.token.access_token
      ? {
        Authorization: `Bearer ${this.token.access_token}`
      }
      : {
        Authorization: ''
      }
  }

  _basicAuthorizationHeader () {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
    }
  }
}

module.exports = PipeDriveClient
export default PipeDriveClient
