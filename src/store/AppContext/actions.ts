import { IAppState } from '.'
import { IBuiltFilter, IQuickSearch } from '../../utils/types'

enum FilterActionTypes {
  CLEAR = 'FILTER::CLEAR',
  QUICK_SEARCH = 'FILTER::QUICK_SEARCH',
  CONSTRUCT = 'FILTER::CONSTRUCT',
  SEARCH = 'FILTER::SEARCH'
}

const filterActions = {
  [FilterActionTypes.CLEAR]: 
    (state: IAppState, payload: [] ) =>
      ({ ...state, builtFilter: {} }),
  [FilterActionTypes.QUICK_SEARCH]: 
    (state: IAppState, payload: IQuickSearch) => {
      // This two ones below is to support specifically Product Name quick searching
      const property = { id: 0, name: 'Product Name', type: 'string' }
      const operator = { text: 'Contains', id: 'contains' }

      return ({
        ...state,
        builtFilter: {
          ...state.builtFilter,
          ...payload,
          ready: true,
          property,
          operator
        }
      })
    },
  [FilterActionTypes.CONSTRUCT]:
    (state: IAppState, payload: IBuiltFilter) => 
      ({ ...state, builtFilter: { ...state.builtFilter, ...payload }}),
  [FilterActionTypes.SEARCH]:
    (state: IAppState) =>
      ({ ...state, builtFilter: { ...state.builtFilter, ready: true }})
}

export {
  FilterActionTypes,
  filterActions,
}