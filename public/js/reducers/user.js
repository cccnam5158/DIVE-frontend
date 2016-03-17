import {
  REQUEST_LOGIN_USER,
  RECEIVE_LOGIN_USER,
  ERROR_LOGIN_USER,
  REQUEST_REGISTER_USER,
  RECEIVE_REGISTER_USER,
  ERROR_REGISTER_USER,
  REQUEST_LOGOUT_USER,
  RECEIVE_LOGOUT_USER,
  ERROR_LOGOUT_USER,
} from '../constants/ActionTypes';

import cookie from 'react-cookie';

const baseState = {
  rememberToken: cookie.load('remember_token') || null,
  isAuthenticated: cookie.load('remember_token') ? true : false,
  username: cookie.load('username') || '',
  email: cookie.load('email') || '',
  id: cookie.load('user_id') || '',
  error: {
    login: '',
    logout: '',
    register: {
      email: null,
      username: null
    }
  },
  success: {
    login: '',
    logout: '',
    register: ''
  },
  properties: {}
}

export default function user(state = baseState, action) {
  switch (action.type) {
    case RECEIVE_LOGIN_USER:
      return { ...state,
        success: { login: action.message, register: '' },
        isAuthenticated: true,
        username: action.username,
        email: action.email,
        id: action.id
      };
    case ERROR_LOGIN_USER:
      return { ...state, error: { ...state.error, login: action.error }};
    case RECEIVE_REGISTER_USER:
      return { ...state,
        success: { register: action.message, login: ''},
        isAuthenticated: true,
        username: action.username,
        email: action.email,
        id: action.id
      };
    case ERROR_REGISTER_USER:
      return { ...state,
        error: {
          ...state.error,
          register: {
            ...state.error.register,
            email: action.emailError,
            username: action.usernameError,
          }
      }};
    case RECEIVE_LOGOUT_USER:
      return {
        ...baseState,
        rememberToken: null,
        username: '',
        email: '',
        id: '',
        isAuthenticated: false
      };
    default:
      return state;
  }
}
