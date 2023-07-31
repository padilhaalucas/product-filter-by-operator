import React, { useState } from 'react'
import { TextField, Box } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { styled } from '@mui/material/styles'

import { IOperator, IProperty } from '../../utils/types'

interface FilterItemProps {
  property: IProperty
  onChange: (id: number, value: string) => void
}

export const SelectProperty = ({
  options,
  label,
  value,
  onChange,
  disabled,
  defaultSelected
}: {
  options: Omit<IProperty, 'values'>[],
  label: string,
  value: string | undefined,
  onChange: (e: SelectChangeEvent) => void,
  disabled: boolean,
  defaultSelected: boolean
}) => (
  <div>
    <FormControl sx={{ minWidth: 180 }} disabled={disabled}>
      <InputLabel id="demo-simple-select-autowidth-label">
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </InputLabel>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={value}
        defaultChecked={defaultSelected}
        onChange={onChange}
        autoWidth
        label={label}
      >
        {options.map((opt: Omit<IProperty, 'values'>, i: number) => (
          <MenuItem key={`${opt.name}-${i}`} value={opt.name}>
            {opt.name.charAt(0).toUpperCase() + opt.name.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
) 

export const SelectOperator = ({
  options,
  label,
  value,
  onChange,
}: {
  options: IOperator[],
  label: string,
  value: string | undefined,
  onChange: (e: SelectChangeEvent) => void
}) => {
  return (
    <div>
      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel id="demo-simple-select-autowidth-label">
          {label}
        </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={value}
          onChange={onChange}
          autoWidth
          label={label}
        >
          {options.map((opt: IOperator, i: number) => (
            <MenuItem key={`${opt.id}-${i}`} value={opt.text}>
              {opt.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#fff',
  },
  '& label': {
    color: '#aaa ',
  },
  '& .MuiInputBase-input': {
    color: '#fff'
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#fff',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#fff',
    },
    '&:hover fieldset': {
      borderColor: '#fff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fff',
    },
  },
});

const FilterItem: React.FC<FilterItemProps> = ({ property, onChange }) => {
  const [value, setValue] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    setValue(newValue)
    onChange(property.id, newValue)
  }

  return (
    <Box>
      <CustomTextField
        label={property.name}
        value={value}
        type={property.type}
        onChange={handleChange}
        variant='outlined'
        fullWidth
        
      />
    </Box>
  )
}

export default FilterItem
