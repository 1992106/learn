// https://github.com/reduxjs/react-redux/blob/master/src/hooks/useStore.ts

import { useContext } from 'react';
import ReactReduxContext from './Context';
import { useReduxContext as useDefaultReduxContext } from './useReduxContext'
export function createStoreHook(context = ReactReduxContext) {
  const useReduxContext =
    context === ReactReduxContext
      ? useDefaultReduxContext
      : () => useContext(context)
  return function useStore() {
    const { store } = useReduxContext()
    return store
  }
}

export const useStore = createStoreHook()

/**
 * @example
 *
 * import React from 'react'
 * import { useStore } from 'react-redux'
 *
 * export const ExampleComponent = () => {
 *   const store = useStore()
 *   return <div>{store.getState()}</div>
 * }
 */
