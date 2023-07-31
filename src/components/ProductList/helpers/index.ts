import { IAppState } from "../../../store/AppContext"
import {
  OperatorID,
  IPropertyValues,
  NormalizedValue,
  FilterValue,
  IBuiltFilter,
  IProduct
} from "../../../utils/types"

const stringCheckers = {
  some: (filterValue: FilterValue, propertyValue: NormalizedValue) =>
    Array.isArray(filterValue) && filterValue.some(
      (v: string | number) => typeof v === 'string' && typeof propertyValue === 'string' 
        ? v.includes(propertyValue)
        : v === propertyValue
    ),
  every: (filterValue: FilterValue, propertyValue: NormalizedValue) =>
    Array.isArray(filterValue) && filterValue.every(
      (v: string | number) => typeof v === 'string' && typeof propertyValue === 'string' 
        ? v.includes(propertyValue)
        : v === propertyValue
    )
}

const normalizeValue = (value: string | number): NormalizedValue =>
  typeof value === 'string' ? value.toLowerCase() : value

const checkNumberValue = (
  filterValue: FilterValue,
  propertyValue: NormalizedValue,
  comparator: (a: number, b: number) => boolean
): boolean => (
  typeof propertyValue === 'number'
  && Array.isArray(filterValue)
  && filterValue.some(
    (value: string | number) => typeof value === 'number' ? comparator(propertyValue, value) : false
  )
)

const operators: Record<OperatorID, (
  filterValue: FilterValue,
  propertyValue: NormalizedValue
) => boolean> = {
  equals: stringCheckers.every,
  greater_than: (filterValue, propertyValue) =>
    checkNumberValue(filterValue, propertyValue, (a, b) => a > b),
  less_than: (filterValue, propertyValue) =>
    checkNumberValue(filterValue, propertyValue, (a, b) => a < b),
  any: (filterValues, propertyValue) => (
    propertyValue !== null && propertyValue !== undefined && propertyValue !== ''
  ),
  none: (filterValues, propertyValue) => (
    propertyValue === null || propertyValue === undefined || propertyValue === ''
  ),
  in: stringCheckers.some,
  contains: (filterValue, propertyValue) => 
    typeof propertyValue === 'string'
    && Array.isArray(filterValue)
    && filterValue.some((value: string | number) => 
      typeof value === 'string' ? propertyValue.includes(value) : false
    ),
}

const compareValues = (
  value: IPropertyValues,
  builtFilter: IBuiltFilter
): boolean => {
  const currentPropertyValue = normalizeValue(value?.value)
  const currentOperator = builtFilter?.operator?.id

  if (currentOperator === 'any') {
    return operators.any('', currentPropertyValue)
  }
  if (currentOperator === 'none') {
    return operators.none('', currentPropertyValue)
  }
  
  if (!currentOperator || !builtFilter?.selectedValues) return false

  return operators[currentOperator as OperatorID](
    builtFilter?.selectedValues, currentPropertyValue
  ) ?? false
}

const applyFilters = (currentState: IAppState) => {
  let { products, builtFilter } = currentState

  if (!builtFilter?.ready) return products

  const valuesToLook = products?.reduce((
    acc: IPropertyValues[],
    currentValue: IProduct
  ): IPropertyValues[] => {
    const valuesFound = currentValue?.property_values?.find(
      (pv: IPropertyValues) => pv.property_id === builtFilter?.property?.id
    )

    if (valuesFound && !acc.find((item: IPropertyValues) => item.value === valuesFound.value)) {
      acc.push(valuesFound)
    }
    return acc
  }, [])

  const comparedValues = valuesToLook?.filter(
    (v: IPropertyValues) => compareValues(v, builtFilter)
  )

  const productsFound = products.filter(product => {
    return product.property_values.some(property_value => (
      comparedValues.some((compared: IPropertyValues) => (
          compared.property_id === property_value.property_id
          && compared.value === property_value.value
        )
      )
    ))
  })
  
  return productsFound
}

export default applyFilters
