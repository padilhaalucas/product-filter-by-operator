import { Container, Typography } from '@mui/material'

import Filter from './components/Filter'
import ProductList from './components/ProductList'

import { ProductProvider } from './store/AppContext'

const App = () => (
  <ProductProvider>
    <Container maxWidth="lg">
      <Typography variant="h2" align="center" margin={'24px 0px 16px 0px'} gutterBottom>
        Salsify Exercise
      </Typography>
      <Filter />
      <ProductList />
    </Container>
  </ProductProvider>
)

export default App
