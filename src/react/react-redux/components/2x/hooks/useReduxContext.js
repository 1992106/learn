// https://github.com/reduxjs/react-redux/blob/master/src/hooks/useReduxContext.ts
import { useContext } from 'react';
import ReactReduxContext from './Context';

export function useReduxContext() {
  const contextValue = useContext(ReactReduxContext)

  if (process.env.NODE_ENV !== 'production' && !contextValue) {
    throw new Error(
      'could not find react-redux context value; please ensure the component is wrapped in a <Provider>'
    )
  }

  return contextValue
}

/**
 * @example
 *
 * import React from 'react'
 * import { useReduxContext } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const { store } = useReduxContext()
 *   return <div>{store.getState()}</div>
 * }
 */
