import errorTypeDetailMap from '$CONFIGS/errorTypeDetailMap'

const errorFormat = {
  code   : '',
  errors : []
}

/**
 * Get HTTP error status type. Determines type by the first digit in error
 *
 * @param  {Number} status HTTP error status
 * @return {String}        Human readable form of error
 */
function getStatusType (status) {
  const hundredPlace = 100
  const statusNameMap = {
    2 : 'success',
    4 : 'unauthed',
    5 : 'network'
  }
  const statusCodeFamily = parseInt(status / hundredPlace)

  return statusNameMap[statusCodeFamily] || 'generic'
}


/**
 * Generate small description of the HTTP Error Status and format error.
 * Will be called only if no error was sent by server.
 *
 * @param  {String} type Parsed error type.
 * @return {Object}      Formatted Error Object, to be sent to view.
 */
function formatResponseError(type) {
  const error = { ...errorFormat }

  error.code = type
  error.errors = errorTypeDetailMap[type]

  return error
}


/**
 * Format errors sent by server.
 *
 * @param  {Object} body    Response sent by the server
 * @param  {String} keyName Error type
 * @return {Object}         Formatter Error Object to be sent to view
 */
function formatServerErrors(body, keyName) {
  const errors = { ...errorFormat }

  errors.errors = []

  for (const error in body.errors) {
    if (body.errors[error] && body.errors[error][keyName]) {
      errors.errors.push(body.errors[error][keyName])
    }
  }

  return errors
}


/**
 * Check if server sent errors.
 *
 * @param  {Object}  body  Response sent by the server
 * @return {Boolean}       Returns true if server sent errors
 */
function didServerSendErrors (body) {
  return body &&
    body.errors &&
    body.errors.length
}


/**
 * Generate formatted error object for different Error types/status
 *
 * @param  {Object} body  Response sent by the server
 * @param  {String} type  parsed error type
 * @return {Object}       formatted error object
 */
function getErrors (body, type) {
  if (didServerSendErrors(body)) {
    return formatServerErrors(body, 'msg')
  }

  return formatResponseError(type)
}


/**
 * Main Function: Process errors sent by server or craft error data if no
 * error object was sent from the server.
 *
 * @param  {Object}   response HTTP response of a network request.
 * @param  {Function} dispatch Redux Store's dispatch reference
 *
 * @return {Object}            Formatted error object
 */
export default async function httpStatusParser (response) {
  const body = await response.json()

  body.httpStatus = response.status
  
  const responseCodeActionMap = {
    success() {
      return body
    },
    unauthed() {
      return body
    },
    network() {
      return getErrors(body, 'network')
    },
    generic() {
      return getErrors(body, 'generic')
    }
  }

  const statusType = getStatusType(response.status)

  return responseCodeActionMap[statusType]()
}

