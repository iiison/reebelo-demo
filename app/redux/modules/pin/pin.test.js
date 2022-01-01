import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as pinActions from './pin'

describe('>>> ACTIONS -- pin Actions', () => {
  describe('• Synchronous Action Creators', () => {
    const {
      setPin,
      setPinSuccess,
      setPinFailure,
      verifyPin,
      verifyPinSuccess,
      verifyPinFailure
    } = pinActions

    it('Tests SET_PIN action creator', () => {
      const expected = 'SET_PIN'
      const { type: result } = setPin()

      expect(result).toBe(expected)
    })

    it('Tests SET_PIN_SUCCESS action creator', () => {
      const expected = 'SET_PIN_SUCCESS'
      const { type: result } = setPinSuccess()

      expect(result).toBe(expected)
    })

    it('Tests SET_PIN_FAILURE action creator', () => {
      const expected = 'SET_PIN_FAILURE'
      const { type: result } = setPinFailure()

      expect(result).toBe(expected)
    })

    it('Tests VERIFY_PIN action creator', () => {
      const expected = 'VERIFY_PIN'
      const { type: result } = verifyPin()

      expect(result).toBe(expected)
    })

    it('Tests VERIFY_PIN_SUCCESS action creator', () => {
      const expected = 'VERIFY_PIN_SUCCESS'
      const { type: result } = verifyPinSuccess()

      expect(result).toBe(expected)
    })

    it('Tests VERIFY_PIN_FAILURE action creator', () => {
      const expected = 'VERIFY_PIN_FAILURE'
      const { type: result } = verifyPinFailure()

      expect(result).toBe(expected)
    })
  })

  describe('• Asynchronous Action Creator -- triggerSetPin', () => {
    const {
      setPin,
      setPinSuccess,
      setPinFailure,
      triggerSetPin,
      verifyPin,
      verifyPinFailure,
      verifyPinSuccess,
      triggerVerifyPin
    } = pinActions
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const mockState = {
      pin: {
        isFetching: false,
        isVerified: false,
        error: ''
      }
    }

    it('Tests triggerSetPin -- Success Case', () => {
      const mockResponse = {
        status: '200'
      }
      const expectedActions = [
        setPin(),
        setPinSuccess(mockResponse)
      ]

      const store = mockStore(mockState)

      fetch.mockResponse(JSON.stringify(mockResponse))

      return store.dispatch(triggerSetPin({
        accountReferenceId: 'abcdef',
        pin: 1234
      })).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    it('Tests triggerSetPin -- Failure Case', () => {
      const expectedActions = [
        setPin(),
        setPinFailure()
      ]

      const store = mockStore(mockState)

      fetch.mockReject()

      return store.dispatch(triggerSetPin({
        accountReferenceId: 'abcdef',
        pin: 1234
      })).catch(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    it('Tests triggerVerifyPin -- Success Case', () => {
      const mockResponse = {
        status: '200'
      }
      const expectedActions = [
        verifyPin(),
        verifyPinSuccess(mockResponse)
      ]

      const store = mockStore(mockState)

      fetch.mockResponse(JSON.stringify(mockResponse))

      return store.dispatch(triggerVerifyPin({
        accountReferenceId: 'abcdef',
        pin: 1234
      })).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    it('Tests triggerVerifyPin -- Failure Case', () => {
      const expectedActions = [
        verifyPin(),
        verifyPinFailure()
      ]

      const store = mockStore(mockState)

      fetch.mockReject()

      return store.dispatch(triggerVerifyPin({
        accountReferenceId: 'abcdef',
        pin: 1234
      })).catch(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})

