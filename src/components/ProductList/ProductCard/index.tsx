import React, { useContext } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'

import { IProduct, IPropertyValues } from '../../../utils/types'
import { AppContext } from '../../../store/AppContext'

type ProductCardType = {
  product: IProduct
  listKey: string
  searchStarted: boolean
}

const ProductCard: React.FC<ProductCardType> = (
  { product, listKey, searchStarted }: ProductCardType
) => {
  const { appState } = useContext(AppContext)
  const { builtFilter } = appState

  const CardSection = (
    { title, propertyID }: { title?: string, propertyID: number }
  ) => {
    const textStyle = {
      margin: '8px 0px 0px 0px',
      ...searchStarted &&
        builtFilter?.property?.id === propertyID &&
        { fontWeight: 'bolder', color: 'green' }
    }

    return (
      <Grid key={`${title}-${propertyID}`}>
        { propertyID !== 0 && 
          <Typography
            color="textSecondary"
            style={{...textStyle, margin: '8px 0px 0px 0px'}}>
            {title}
          </Typography>
        }
        <Typography
          variant={"h5"}
          component="h2"
          style={{...propertyID === 0 && textStyle, margin: '0px 0px 8px 0px'}}
        >
          <strong>
            { product.property_values?.find((pv: IPropertyValues) =>
              pv.property_id === propertyID)?.value ?? '-'
            }
          </strong>
        </Typography>
      </Grid>
    )
  }

  return (
    <Card key={listKey} style={{ marginBottom: '15px', ...searchStarted && { border: '4px solid green' } }}>
      <CardContent>
        <CardSection propertyID={0} />
        <Grid container direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <CardSection title='Color:' propertyID={1} />
          <CardSection title='Weight (oz):' propertyID={2} />
          <CardSection title='Category:' propertyID={3} />
          <CardSection title='Wireless?' propertyID={4} />
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductCard
