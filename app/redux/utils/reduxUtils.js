// import errorTypeDetailMap from '$CONFIG/errorTypeDetailMap'
const errorTypeDetailMap = {}

function makeActionByType(actionName, type) {
  const typeValueMap = {
    success: '_SUCCESS',
    failure: '_FAILURE'
  }

  return {
    type: `${actionName}${typeValueMap[type]}`
  }
}

export function makeActions(actionName) {
  return {
    defaultAction(options = {}) {
      return {
        type: actionName,
        ...options
      }
    },
    successAction(response) {
      return {
        ...makeActionByType(actionName, 'success'),
        response
      }
    },
    failureAction(error = errorTypeDetailMap.generic) {
      return {
        ...makeActionByType(actionName, 'failure'),
        error
      }
    }
  }
}

export const defaultState = {
  isFetching: true,
  error: ''
}

export function makeReducer({
  actionName,
  additionalActions,
  initialState = defaultState,
  shouldMergeDefaultStates = false
}) {
  const mergedState = shouldMergeDefaultStates
    ? {
      ...defaultState,
      ...initialState
    } : initialState

  return function (state = mergedState, action) {
    const moreActions = additionalActions ? additionalActions(state, action) : {}
    const options = {
      [actionName]: () => ({
        ...state,
        isFetching: true
      }),
      [makeActionByType(actionName, 'failure').type]: () => ({
        ...state,
        isFetching: false,
        error: action.error
      }),
      [makeActionByType(actionName, 'success').type]: () => ({
        ...state,
        error: '',
        isFetching: false,
        isVerified: true,
        response: action.response
      }),
      ...moreActions
    }

    return action.type && options[action.type] ? options[action.type]() : state
  }
}
