import { useCallback, useContext, useState, useEffect } from 'react'
import { Box, SelectChangeEvent } from '@mui/material'
import Grid from '@mui/material/Grid'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import Stack from '@mui/material/Stack'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from "@mui/material/IconButton"
import NorthIcon from '@mui/icons-material/North'

import FilterItem, { SelectProperty, SelectOperator } from '../FilterItem'
import { GradientButton, BlackWhiteButton } from '../Button'

import { useFilterActions } from '../../hooks/filter'
import { AppContext } from '../../store/AppContext'
import { getAvailableOperators, getCurrentFilterCheckboxes } from '../../utils/data'
import { FilterActionTypes } from '../../store/AppContext/actions'
import { IBuiltFilter } from '../../utils/types'

const FilterButtonIcon = ({ builtFilter }: { builtFilter: IBuiltFilter }) => (
  builtFilter?.ready
  && builtFilter?.operator?.id !== 'any'
  && builtFilter?.operator?.id !== 'none'
    ? <NorthIcon/> : <FilterAltIcon />
)

const Filter = () => {
  const { appState, dispatch } = useContext(AppContext)
  const {
    properties,
    products,
    builtFilter
  } = appState

  const {
    submitFilter,
    changeProperty,
    changeOperator,
    changeFilters
  } = useFilterActions()

  const availableOperators = getAvailableOperators(builtFilter?.property)
  const currentFilterCheckboxes = getCurrentFilterCheckboxes(products, builtFilter?.property)
  const [checkboxStates, setCheckboxStates] = useState({})
  const [quickSearchIsOn, setQuickSearchIsOn] = useState(false)

  const [filterButtonIsDisabled, setFilterButtonIsDisabled] = useState(true)

  useEffect(() => {
    const selectedValuesHasValue =
      !!builtFilter?.selectedValues && builtFilter?.selectedValues?.length !== 0;
    const isFilterOperatorNotAnyOrNone =
      builtFilter?.operator?.id !== 'any' && builtFilter?.operator?.id !== 'none'
    const isFilterReady = !!builtFilter?.ready;
  
    const isButtonDisabled = ((!selectedValuesHasValue && isFilterOperatorNotAnyOrNone) || isFilterReady)

    setFilterButtonIsDisabled(isButtonDisabled);
  }, [builtFilter?.operator?.id, builtFilter?.ready, builtFilter?.selectedValues, checkboxStates]);

  useEffect(() => {
    if (!!builtFilter?.operator) {
      let newCheckboxStates: { [key: string]: boolean } = {}
      currentFilterCheckboxes?.values?.forEach((option: string) => {
        newCheckboxStates[option as keyof typeof newCheckboxStates] = false
      })
      
      setCheckboxStates(newCheckboxStates)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builtFilter?.operator])

  const filterButtonText = builtFilter?.ready
    && builtFilter?.operator?.id !== 'any'
    && builtFilter?.operator?.id !== 'none'
      ? 'You can continue filtering by changing the checkboxes above'
      : 'Filter it!'

  const renderPossibilitiesToFilter = useCallback(() => {
    if (builtFilter?.operator === null) return
    return (
      <FormGroup style={{ flexDirection: 'row' }}>
        { currentFilterCheckboxes?.values?.map((option: string , i: number) => (
          <FormControlLabel
            key={`${option}-${i}`}
            control={
              <Checkbox
                checked={checkboxStates[option as keyof typeof checkboxStates] ?? false}
                onChange={(e) => {
                  setCheckboxStates({
                    ...checkboxStates,
                    [option]: e.target.checked
                  })
                  changeFilters(
                    {
                      property_id: currentFilterCheckboxes?.property_id,
                      value: option
                    },
                    e.target.checked
                  )
                }}
              />
            }
            label={option}
          />
        ))}
      </FormGroup>
    )
  }, [
    builtFilter?.operator,
    changeFilters,
    checkboxStates,
    currentFilterCheckboxes?.property_id,
    currentFilterCheckboxes?.values
  ])

  const renderQuickSearch = useCallback(() => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '4px', 
      marginBottom: '16px', 
      width: '30%', 
      background: 'linear-gradient(90deg, #c31f83 0%, #8a25f8 80%)',
      padding: '16px',
      color: '#fff',
      borderRadius: '8px'
    }}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} height={'24px'} margin={'0'}>
        <strong>Just type and check the results ⚡️</strong>
        <IconButton onClick={() => setQuickSearchIsOn(false)}>
          <CancelIcon sx={{ ":hover": { cursor: 'pointer' }}} />
        </IconButton>
      </Box>
      <i>(by name)</i>
      <FilterItem
        key={properties[0].id}
        property={properties[0]}
        onChange={(id: number, value: string) => {
          if (value !== '') {
            dispatch({
              type: FilterActionTypes.QUICK_SEARCH,
              payload: { property_id: id, selectedValues: [value?.toLowerCase()] },
            })
          } else {
            dispatch({
              type: FilterActionTypes.CLEAR,
              payload: []
            })
          }
        }}
      />
    </Box>
  ), [dispatch, properties])

  const renderContent = useCallback(() => (
    <Grid container direction={'column'} height={'20vh'}>
      {
        !quickSearchIsOn &&
        <>
          <Grid container direction={'row'}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
              <SelectProperty
                key={builtFilter?.property?.id}
                options={properties}
                label={'Select a property'}
                value={builtFilter?.property?.name ?? ''}
                defaultSelected={false}
                disabled={!!builtFilter?.operator}
                onChange={(e: SelectChangeEvent) =>
                  changeProperty(e.target.value)
                }
              />
              {
                builtFilter?.property &&
                <SelectOperator
                  key={builtFilter?.operator?.id}
                  options={availableOperators ?? []}
                  label={'Select an Operator'}
                  value={builtFilter?.operator?.text}
                  onChange={(e: SelectChangeEvent) => changeOperator(e.target.value)}
                />
              }
              {
                builtFilter?.operator?.id !== 'any' &&
                builtFilter?.operator?.id !== 'none' &&
                !!builtFilter?.operator &&
                renderPossibilitiesToFilter()
              }
            </Box>
          </Grid>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <Stack direction="row" spacing={1}>
              <BlackWhiteButton
                startIcon={<DeleteIcon />}
                onClick={() => {
                  dispatch({ type: FilterActionTypes.CLEAR, payload: [] })
                  setCheckboxStates({})
                }}
              >
                Clear filter
              </BlackWhiteButton>
              <GradientButton
                endIcon={<FilterButtonIcon builtFilter={builtFilter}/>}
                onClick={submitFilter}
                disabled={filterButtonIsDisabled}
              >
                {filterButtonText}
              </GradientButton>
              {
              (filterButtonIsDisabled) ?
                <GradientButton
                  endIcon={'⚡️'}
                  onClick={() => setQuickSearchIsOn(true)}
                  disabled={quickSearchIsOn}
                >
                  <strong>{quickSearchIsOn ? 'Quick enabled' : 'Quick filter'}</strong>
                </GradientButton> :
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'grey'}}>
                  Clear filter to allow quick again ⚡️
                </Box>
              }
            </Stack>
          </Box>
        </>
      }

      { quickSearchIsOn && renderQuickSearch() }

    </Grid>
  ), [
    availableOperators,
    builtFilter,
    changeProperty,
    changeOperator,
    dispatch,
    filterButtonIsDisabled,
    filterButtonText,
    properties,
    quickSearchIsOn,
    renderPossibilitiesToFilter,
    submitFilter,
    renderQuickSearch
  ])

  return renderContent()
}

export default Filter
