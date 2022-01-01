/**
 * Check if value is a function 
 *
 * @param  {Any} value input value
 *
 * @return {Boolean}   true if value is a function
 */
export function isFunction(value) {
  return value && typeof value === 'function' 
}

/**
 * Checks for datatype and data presence in a variable
 *
 * @param  {Any}    data data to be tested
 * @param  {String} type type name
 *
 * @return {Boolean}     returns false if type doesn't match
 */
function checkType(data, type) {
  if (!data) {
    return false
  }

  const dataTypeMap = {
    object() {
      return data.constructor === Object && Object.keys(data).length > 0
    },

    array() {
      return data.constructor === Array && data.length > 0
    }
  }

  if (!dataTypeMap[type]) {
    return null
  }

  return dataTypeMap[type.toLowerCase()]()
}

/**
 * Check if errors have data
 *
 * @param  {String|Array} errors errors data
 * @return {Boolean}             returns true if errors has data
 */
function checkErrors(errors) {
  if (errors.length > 0 || checkType(errors, 'array')){
    return true
  }

  return false
}

/**
 * Check if response data is non-empty
 *
 * @param  {String|Array} data errors data
 * @return {Boolean}           returns true if errors has data
 */
function checkResponseData(data) {
  if (checkType(data, 'array') || checkType(data, 'object') || data.length > 0){
    return true
  }

  return false
}


/**
 * Used by Container or a component to decide which data needs to be shown
 * Selects the presentable data, the precedence is isFetching > errors > responseData
 *
 * @param  {Boolean}              obj.isFetching   if data is still being fetched
 * @param  {String|Array}         obj.errors       errors in the API response or FE logic
 * @param  {Object|Array|String}  obj.responseData API response
 *
 * @return {String}                                respective flag for the data to be shown
 */
export function selectPresentableData({ isFetching, error = '', response }) {
  if (isFetching) {
    return 'loading'
  }

  if (error && checkErrors(error)) {
    return 'errors'
  }

  if (response && checkResponseData(response)) {
    return 'hasData'
  }

  return 'noData'
}

/**
 * Convert Array into an Object with input key
 *
 * @param {Array}  list   input array
 * @param {String} idName key name of output object
 *
 * @return {Object}       Output map
 */
export function makeListMap(list, idName = 'id') {
  return list.reduce((prev, curr) => ({
    ...prev,
    [curr[idName]] : curr
  }), {})
}

/**
 * Debounce input function
 *
 * @param   {Function} func function to be debounced
 * @param   {Number}   time time to wait
 *
 * @returns {Function}      debounced function
 */
export function debounce(func, time = 100) {
  let timeout

  return function(...args) {
    const ref = this

    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(ref, args), time)
  }
}
