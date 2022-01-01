import store from '$CONFIGS/store'
import {
  makeReducer,
  makeActions
} from '$RUTILS/reduxUtils'

const SET_USER_DATA = 'SET_USER_DATA'
const {
  defaultAction : setUserData
} = makeActions(SET_USER_DATA)

export const initialState = {
  isFetching : false,
  error      : '',
  isAdmin    : false
}

const user = makeReducer({
  actionName : SET_USER_DATA,
  initialState
})

export default user

