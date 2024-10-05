// https://github.com/reduxjs/react-redux/blob/master/src/hooks/useDispatch.ts

import ReactReduxContext from './Context';
import { useStore as useDefaultStore, createStoreHook } from './useStore'

export function createDispatchHook(context = ReactReduxContext) {
  const useStore =
    context === ReactReduxContext ? useDefaultStore : createStoreHook(context)

  return function useDispatch() {
    const store = useStore()
    return store.dispatch
  }
}

export const useDispatch = createDispatchHook()

/**
 * @example
 *
 * import React, { useCallback } from 'react'
 * import { useDispatch } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   const increaseCounter = useCallback(() => dispatch({ type: 'increase-counter' }), [])
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={increaseCounter}>Increase counter</button>
 *     </div>
 *   )
 * }
 */
