import { useCallback, useContext } from "react"

import { AppContext } from "../../store/AppContext"
import { FilterActionTypes } from "../../store/AppContext/actions"
import { getAvailableOperators } from "../../utils/data"
import { IPropertyValues, IProperty } from "../../utils/types"

export const useFilterActions = () => {
  const { appState, dispatch } = useContext(AppContext)
  const {
    properties,
    builtFilter
  } = appState
  const availableOperators = getAvailableOperators(builtFilter?.property)

  const submitFilter = () =>
    dispatch({ type: FilterActionTypes.SEARCH })

  const changeProperty = (choosedProperty: string) => {
    const newProperty = properties?.find(
      (property: IProperty) => property.name === choosedProperty
    )
    if (newProperty) {
      dispatch({
        type: FilterActionTypes.CONSTRUCT,
        payload: { property: newProperty }
      })
    }
  }

  const changeOperator = (choosedOperator: string) => {
    dispatch({
      type: FilterActionTypes.CONSTRUCT,
      payload: {
        ...(builtFilter?.property && { property: builtFilter?.property }),
        ...(builtFilter?.selectedValues && { selectedValues: [] }),
        ...(builtFilter?.ready && { ready: false })
      }
    })
    const newOperator = availableOperators && availableOperators.find(
      operator => operator.text === choosedOperator
    )
    if (newOperator) {
      dispatch({
        type: FilterActionTypes.CONSTRUCT,
        payload: { operator: newOperator }
      })
    }
  }

  const changeFilters = useCallback((option: IPropertyValues, checked: boolean) => {
    let value = typeof option.value === 'string'
      ? option.value.toLowerCase()
      : option.value
  
    if (checked) {
      const updatedSelectedValues = builtFilter?.selectedValues 
        ? [...builtFilter.selectedValues, value]
        : [value]

      dispatch({
        type: FilterActionTypes.CONSTRUCT,
        payload: { selectedValues: updatedSelectedValues }
      })
    } else {
      if (builtFilter?.selectedValues) {
        const remainingOptions = builtFilter.selectedValues.filter((v: string) => v !== value)
        dispatch({
          type: FilterActionTypes.CONSTRUCT,
          payload: { selectedValues: remainingOptions }
        })
      }
    }
  }, [builtFilter.selectedValues, dispatch]) 

  return {
    submitFilter,
    changeProperty,
    changeOperator,
    changeFilters,
  }
}
