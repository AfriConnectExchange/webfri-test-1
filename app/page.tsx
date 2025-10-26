import Filters from '../components/Filters'
import Box from '@mui/material/Box'
// Grid was previously used but replaced with CSS grid via Box
import ProductCard from '../components/ProductCard'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 2, py: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 3 }}>
            <Box>
              <Filters />
            </Box>

            <Box>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' } }}>
                {Array.from({ length: 9 }).map((_, idx) => {
                  const price = (idx + 1) * 19.99
                  const product = {
                    id: `prod_${idx + 1}`,
                    title: `Product ${idx + 1} — Great Item`,
                    price,
                    category: idx % 2 === 0 ? 'Phones' : 'Laptops',
                    tags: ['New', 'Hot', 'Warranty'],
                    location: idx % 3 === 0 ? 'London' : 'Manchester',
                    // deterministic rating for render purity
                    rating: 3 + (idx % 3) * 0.5,
                  }
                  return (
                    <Box key={idx}>
                      <ProductCard {...product} />
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
      </Box>
    </main>
  )
}
