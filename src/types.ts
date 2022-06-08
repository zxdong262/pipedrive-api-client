
interface TokenBase {
  refresh_token?: string,
  access_token?: string,
  apiToken?: string,
  token_type?: string
  scope?: string
  expires_in?: number
  api_domain?: string
}

export interface Token {
  [key : string]: any | TokenBase
}

export interface Logger {
  log: Function
}

export interface Options {
  host?: string
  apiToken?: string
  clientId: string,
  clientSecret: string,
  oauthServer?: string,
  redirectUri?: string
  appName?: string,
  appVersion?: string,
  token?: Token,
  logger?: Logger
}

export interface ConfigBase {
  url?: string,
  headers?: Object
}

export interface Config {
  [key : string]: any | ConfigBase
}

export interface Data {
  [key : string]: any
}
