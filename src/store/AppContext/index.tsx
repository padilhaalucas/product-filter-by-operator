import React, { createContext, useReducer, Dispatch } from 'react'

import datastore from '../../datastore'
import { IProduct, IProperty, IOperator, IBuiltFilter, IQuickSearch } from '../../utils/types'
import {
  filterActions,
  FilterActionTypes,
} from './actions'

export interface IAppState {
  products: IProduct[]
  properties: IProperty[]
  operators: IOperator[]
  builtFilter: {
    property?: IProperty,
    operator?: IOperator,
    selectedValues?: string[],
    ready?: boolean
  }
}

type AppAction = 
  | { type: FilterActionTypes.CLEAR; payload: [] }
  | { type: FilterActionTypes.QUICK_SEARCH, payload: IQuickSearch }
  | { type: FilterActionTypes.CONSTRUCT, payload: IBuiltFilter }
  | { type: FilterActionTypes.SEARCH; payload?: any }

const initialState: IAppState = {
  ...datastore,
  builtFilter: { ready: false },
}

const reducer = (state: IAppState, action: AppAction): IAppState => {
  switch (action?.type) {
    case FilterActionTypes.CLEAR:
    case FilterActionTypes.QUICK_SEARCH:
    case FilterActionTypes.CONSTRUCT:
    case FilterActionTypes.SEARCH:
      return filterActions[action.type as keyof typeof filterActions](state, action.payload)

    default:
      throw new Error(`Unknown action type.`)
  }
}

interface AppContextProps {
  appState: IAppState
  dispatch: Dispatch<AppAction>
}

export const AppContext = createContext<AppContextProps>({
  appState: initialState,
  dispatch: () => undefined
})

export const ProductProvider = ({ children }: { children: JSX.Element}) => {
  const [appState, dispatch] = useReducer(reducer, initialState)  

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}
