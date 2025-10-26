export const sampleProduct = {
  id: 'prod_001',
  title: 'Handcrafted Wooden Stool',
  price: 79.99,
  currency: 'GBP',
  images: [
    { src: '/images/products/stool-1.jpg', alt: 'Handcrafted wooden stool - front' },
    { src: '/images/products/stool-2.jpg', alt: 'Handcrafted wooden stool - side' },
    { src: '/images/products/stool-3.jpg', alt: 'Handcrafted wooden stool - detail' },
  ],
  rating: { average: 4.6, count: 124 },
  availability: 'in-stock',
  highlights: ['In stock', '2-year warranty', 'Ships in 1-2 days'],
  specs: [
    { key: 'Material', value: 'Sustainably sourced mahogany' },
    { key: 'Dimensions', value: '40cm × 40cm × 45cm' },
    { key: 'Weight', value: '3.2kg' },
  ],
  descriptionHtml: '<p>Beautifully handcrafted stool made from sustainably sourced wood. Perfect for kitchens and studios.</p>',
  seller: {
    id: 'seller_12',
    name: 'Akin Timberworks',
    avatar: '/images/sellers/akin.jpg',
    verified: true,
    rating: 4.8,
    joinedYear: 2019,
  },
}

export default sampleProduct
