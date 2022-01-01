import * as reduxUtils from './reduxUtils.js'

const TEST_ACTION = 'TEST_ACTION'

describe('>>> Redux Utils Function -- makeActions', () => {
  const {
    defaultAction,
    successAction,
    failureAction
  } = reduxUtils.makeActions(TEST_ACTION)

  it('Tests default action', () => {
    const result = defaultAction()
    const expected = {
      type : TEST_ACTION
    }

    expect(result).toEqual(expected)
  })

  it('Tests success action', () => {
    const mockResponse = {
      test : 1234
    }

    const expected = {
      type     : 'TEST_ACTION_SUCCESS',
      response : mockResponse
    }
    const result = successAction(mockResponse)

    expect(result).toEqual(expected)
  })

  it('Tests failure action', () => {
    const mockError = 'Some Error'

    const expected = {
      type  : 'TEST_ACTION_FAILURE',
      error : mockError
    }
    const result = failureAction(mockError)

    expect(result).toEqual(expected)
  })
})

describe('>>> Redux Utils Function -- makeReducer', () => {
  const {
    makeActions,
    makeReducer,
    defaultState
  } = reduxUtils

  it('Tests reducer type', () => {
    const reducer = makeReducer({ actionName : TEST_ACTION })

    expect(typeof reducer).toBe('function')
  })

  describe('• Reucer tests with default params', () => {
    const initialState = defaultState
    const reducer = makeReducer({ actionName : TEST_ACTION })
    const {
      defaultAction,
      successAction,
      failureAction
    } = makeActions(TEST_ACTION)

    it('Tests default action', () => {
      const result = reducer(initialState, defaultAction())
      const expected = initialState

      expect(result).toEqual(expected)
    })

    it('Tests non-existing action', () => {
      const result = reducer(initialState, {
        type : 'RANDOM_ACTION'
      })
      const expected = initialState

      expect(result).toEqual(expected)
    })

    it('Tests success action', () => {
      const mockResponse = 'test'
      const result = reducer(initialState, successAction(mockResponse))
      const expected = {
        ...initialState,
        isFetching : false,
        response   : mockResponse
      }

      expect(result).toEqual(expected)
    })

    it('Tests failure action', () => {
      const mockError = 'dummy error'
      const result = reducer(initialState, failureAction(mockError))
      const expected = {
        ...initialState,
        isFetching : false,
        error      : mockError
      }

      expect(result).toEqual(expected)
    })
  })

  describe('• Reucer tests with custom params', () => {
    let initialState, customState

    const { defaultAction } = makeActions(TEST_ACTION)

    beforeEach(() => {
      customState = {
        customProp  : '',
        anotherProp : 1234
      }

      initialState = {
        isFetching : true,
        error      : ''
      }
    })

    function makeCustomReducer(config = {}) {
      return makeReducer({
        ...config,
        actionName : TEST_ACTION
      })
    }

    it('Tests reducer with custom initialState with shouldMergeDefaultStates true', () => {
      const reducer = makeCustomReducer({
        initialState : {
          ...customState,
          isFetching : false
        },
        shouldMergeDefaultStates : true
      })
      const expectedState = {
        ...initialState,
        ...customState,
        isFetching : false
      }
      const result = reducer(expectedState, defaultAction())

      const expected = {
        ...expectedState,
        isFetching : true
      }

      expect(result).toEqual(expected)
    })

    it('Tests reducer with custom initialState with shouldMergeDefaultStates false', () => {
      const reducer = makeCustomReducer({
        initialState : {
          ...customState,
          isFetching : false
        },
        shouldMergeDefaultStates : false
      })
      const expectedState = {
        ...customState,
        isFetching : false
      }
      const result = reducer(expectedState, defaultAction())

      const expected = {
        ...expectedState,
        isFetching : true
      }

      expect(result).toEqual(expected)
    })

    it('Test reducer with additional action', () => {
      const reducer = makeReducer({
        actionName : TEST_ACTION,
        additionalActions(state) {
          return {
            NEW_ACTION : () => ({
              ...state,
              customProp : 'testing'
            })
          }
        }
      })
      const expectedState = {
        ...customState,
        customProp : 'testing'
      }

      const result = reducer(customState, {
        type : 'NEW_ACTION'
      })

      expect(result).toEqual(expectedState)
    })
  })
})

