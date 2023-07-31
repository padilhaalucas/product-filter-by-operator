import { IOperator, IProduct, IProperty, IPropertyValues } from "../types"

export const getAvailableOperators = (selectedProperty: IProperty | null | undefined) => {
  if (!selectedProperty) return
  const validOperators = {
    string: [
      { text: 'Equals', id: 'equals'},
      { text: 'Has any value', id: 'any'},
      { text: 'Has no value', id: 'none' },
      { text: 'Is any of', id: 'in' },
      { text: 'Contains', id: 'contains' }
    ] as IOperator[],
    number: [
      { text: 'Equals', id: 'equals'},
      { text: 'Is greater than', id: 'greater_than' },
      { text: 'Is less than', id: 'less_than' },
      { text: 'Has any value', id: 'any'},
      { text: 'Has no value', id: 'none' },
      { text: 'Is any of', id: 'in' }
    ] as IOperator[],
    enumerated: [
      { text: 'Equals', id: 'equals'},
      { text: 'Has any value', id: 'any'},
      { text: 'Has no value', id: 'none' },
      { text: 'Is any of', id: 'in' }
    ] as IOperator[]
  }

  return validOperators[selectedProperty?.type as keyof typeof validOperators]
}

export const getCurrentFilterCheckboxes = (
  products: IProduct[],
  selectedProperty: IProperty | null | undefined
) => {
  if (!selectedProperty) return
  const _sort = (arr: string[]) => (
    arr.sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    })
  )

  const options = selectedProperty
    ? products?.reduce((acc: any, product: IProduct) => {
        const propertyValue = product.property_values.find(
          (pv: IPropertyValues) => pv.property_id === selectedProperty.id
        )
  
        if (propertyValue) {            
          const alreadyExists =
            acc.values?.some((option: string) =>  option === propertyValue.value)
  
          if (!alreadyExists) {
            acc.property_id = propertyValue.property_id;
            if (acc.values) {
              acc.values.push(propertyValue.value);
            } else {
              acc.values = [propertyValue.value];
            }
          }
        }
        return {...acc, values: _sort(acc.values)}
      }, {})
    : {}

  return options
}