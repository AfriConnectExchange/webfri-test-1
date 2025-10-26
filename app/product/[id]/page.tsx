import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ProductGallery from '../../../components/product/ProductGallery'
import ProductInfo from '../../../components/product/ProductInfo'
import ProductSpecs from '../../../components/product/ProductSpecs'
import ReviewsList from '../../../components/product/ReviewsList'
import SellerCard from '../../../components/product/SellerCard'
import RelatedProducts from '../../../components/product/RelatedProducts'
import sampleProduct from '../../../lib/mocks/productMock'
import sampleReviews from '../../../lib/mocks/reviewsMock'
import relatedProducts from '../../../lib/mocks/relatedProductsMock'

type Product = {
  id: string
  title: string
  price: number
  images: { src: string; alt?: string }[]
  descriptionHtml: string
  specs: { key: string; value: string }[]
  highlights?: string[]
  rating?: { average: number; count: number }
  seller?: { name: string; avatar?: string; verified?: boolean }
}

export default function ProductPage() {
  // For now we ignore params and use mock data
  const product = sampleProduct as Product

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '520px 1fr' }, gap: 4 }}>
        <Box>
          <ProductGallery images={product.images} />
        </Box>

        <Box>
          <ProductInfo product={product} />
          <Box sx={{ mt: 3 }}>
            {product.seller && <SellerCard seller={product.seller} />}
          </Box>
        </Box>
      </Box>

      {/* Below fold: description and specs (placeholder) */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ mb: 2 }}>
          <h3>Description</h3>
          <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          <Box>
            <ProductSpecs specs={product.specs} />
            <Box sx={{ mt: 4 }}>
              <ReviewsList reviews={sampleReviews} />
            </Box>
          </Box>

          <Box>
            <RelatedProducts items={relatedProducts} />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
