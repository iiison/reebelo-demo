/* global isProduction:true, testAPI:true */
import envURLS            from '$CONFIGS/envURLS'
import errorTypeDetailMap from '$CONFIGS/errorTypeDetailMap'

import httpStatusParser   from './httpStatusParser'

const defaultHeaders = () => ({
  'Content-Type' : 'application/json'
})

/**
 * Conversts `payload` Object(in reqObj) passed to get into query string
 *
 * @param {Object} query  the `payload` property of reqObj of get
 *
 * @return {String}        parsed query string
 */
function makeQueryString(query) {
  const esc = encodeURIComponent

  return Object.keys(query)
    .map((value) => `${esc(value)}=${esc(query[value])}`)
    .join('&')
}

/**
 * Select Server URL as per environment
 *
 * @param  {String} envName Environment Name, optional.
 *
 * @return {String}         URL
 */
function selectEnvURL(envName, type = 'http') {
  const typeNameMap = {
    http : {
      prod  : 'prod',
      alpha : 'alpha'
    }
  }

  if (envName || testAPI) {
    return envURLS[envName] || envURLS[testAPI]
  }


  if (isProduction) {
    return `${window.location.origin}/vies-service/`
    // return envURLS[typeNameMap[type].prod]
  }

  return envURLS[typeNameMap[type].alpha]
}

/**
 * Get Request wrapper
 * @param  {String} reqObj  Request Data, should have:
 *                          - path {String} API path
 *                          - query
 * @param  {String} envName If making request to different environment
 * @return {Promise}        Promise of get request
 */
/* eslint-disable */
export async function get(reqObj, envName) {
  let response, url

  if (!reqObj.path) {
    return false
  }

  url = selectEnvURL()

  if (envName) {
    url = envURLS[envName]
  }

  url += reqObj.path

  url += reqObj.payload ? `?${makeQueryString(reqObj.payload)}` : ''

  try {
    response = await fetch(url, {
      method  : 'GET',
      headers : {
        ...defaultHeaders(),
        ...reqObj.headers,
        // Authorization : getCookie('access_token')
      }
    })
  } catch (exception) {
    throw errorTypeDetailMap.generic
  }

  if (reqObj.isForFile) {
    return response
  }

  const responseHeaders = {}

  if (reqObj.getResponseHeaders) {
    for (const [key, value] of response.headers.entries()) {
      if (reqObj.getResponseHeaders.includes(key)) {
        responseHeaders[key] = value
      }
    }
  }

  const body = await httpStatusParser(response, reqObj.dispatch, reqObj.shouldRedirectToLogin)

  if (body.errors) {
    throw Error(body.errors)
  } else {
    return reqObj.getResponseHeaders 
      ? {
        response : body,
        responseHeaders
      } : body
  }
}

/**
 * Post Request wrapper
 * @param  {Object} reqObj  request data, should have
 *                          - path {String}  URL to hit
 *                          - payload {Object} Post payload
 * @param  {String} envName if making request to different environment
 * @return {Promise}        Post Promise
 */
export async function post(reqObj, envName) {
  let response,
    url = selectEnvURL(envName)

  if (reqObj !== Object(reqObj)) {
    return false
  }

  reqObj.payload = reqObj.payload || {}
  reqObj.headers = reqObj.headers || {}

  const headers = {
    ...defaultHeaders(),
    ...reqObj.headers,
  }

  url += reqObj.path

  try {
    response = await fetch(url, {
      headers,
      method : 'POST',
      body   : JSON.stringify(reqObj.payload)
    })
  } catch (exception) {
    throw exception || errorTypeDetailMap.generic
  }

  const body = await httpStatusParser(response, reqObj.dispatch)

  if (body.errors) {
    throw Error(body.errors)
  } else {
    return body
  }
}

