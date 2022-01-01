import { useSetState } from './reactUtils'
import { renderHook, act } from '@testing-library/react-hooks'

const defaultState = {
  val1 : '',
  val2 : '',
  val3 : ''
}

describe('>> UTILS -- React Utils', () => {
  describe('• useSetState function', () => {
    it('tests if function returns right values', () => {
      const { result } = renderHook(() => useSetState(defaultState))
      const [state] = result.current

      expect(state).toBe(defaultState)
    }),

    it('tests if hook updates the value', () => {
      const { result } = renderHook(() => useSetState(defaultState))

      act(() => result.current[1]({val2 : 32}))

      expect(result.current[0]).toStrictEqual({
        ...defaultState,
        val2 : 32
      })
    })
  })
})

