export type OperatorID = 'equals' | 'greater_than' | 'less_than' | 'any' | 'none' | 'in' | 'contains'

export type NormalizedValue = string | number | null | undefined
export type FilterValue = Array<string | number> | string | number

export interface IPropertyValues {
  property_id?: number
  value: any
}

export interface IProduct {
  id: number
  property_values: IPropertyValues[]
}

export interface IOperator {
  text: string
  id: OperatorID
}

export interface IProperty {
  id: number
  name: string
  type: string
  values: string[]
}

export interface IQuickSearch {
  property_id: number,
  selectedValues: string[]
}

export interface IBuiltFilter {
  operator?: IOperator
  property?: IProperty
  ready?: boolean
  selectedValues?: string[]
}

