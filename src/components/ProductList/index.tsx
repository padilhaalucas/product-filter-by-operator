import { useContext } from 'react'
import { Box, Chip, Grid } from '@mui/material'

import ProductCard from './ProductCard'

import { AppContext } from '../../store/AppContext'
import applyFilters from './helpers'

import { IProduct } from '../../utils/types'

const compStyle = {
  wrapper: {
    overflowY: 'scroll',
    height: '55vh',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '2px 2px 4px rgba(200, 200, 200, 0.6)'
  }
}

const ProductList = () => {
  const { appState } = useContext(AppContext)
  const { builtFilter } = appState
  const products = applyFilters(appState)

  const chipSuffix =
    products?.length === 1 ? ' was' : products?.length !== 0 ? 's were' : 's'

  return (
    <Box
      key={'product-list'}
      component="div" sx={compStyle.wrapper}>
      { builtFilter?.selectedValues 
        && builtFilter.selectedValues?.length > 0
        && builtFilter?.ready &&
        <Chip
          label={
            <Box>
              <strong>
                {products?.length !== 0 ? products?.length : 'No'}
              </strong>
              {' '}product{chipSuffix} found
            </Box>
          }
          style={{ margin: '0px 8px 16px 0px' }}
          color='success'
          variant='outlined'
        />
      }
      { products?.length > 0 ?
        products?.map((product: IProduct, i: number) =>
          <ProductCard
            product={product}
            listKey={`${product.id}-${i}`}
            searchStarted={builtFilter?.ready ?? false}
          />
        )
        : (
          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            width={'100%'}
            height={'100%'}
          >
            Nothing to show...
          </Grid>
        )
      }
    </Box>
  )
}

export default ProductList
