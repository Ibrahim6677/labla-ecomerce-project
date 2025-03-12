import { useState } from "react";
import ProductCard from "./ProductCard";
import ShopFiltering from "./ShopFiltering";
import { useFetchAllProductsQuery } from "../../redux/features/products/productsApi";
const filter = {
  categories: ['All', 'Accessories', 'dress', 'jewellery', 'cosmetics'],
  colors: ['All', 'Black', 'Red', 'Blue', 'Gold', 'Silver', 'Beige', 'Green'],
  priceRanges: [
    {label: 'Under 50$', min:0 , max:50},
    { label: '50$ - 100$', min: 50, max: 100 },
    {label: '100$ - 200$', min: 100, max: 200},
    {label: '200$ and above', min: 200, max: Infinity},
  ]
}

const ShopPage = () => {
  const [filtersState, setFiltersState] = useState({
    category: 'All',
    color: 'All',
    priceRange: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const { category, color, priceRange } = filtersState;
  const [minPrice, maxPrice] = priceRange.split('-').map(Number);

  const {data: {products = [], totalPages, totalProducts} = {}, error, isLoading} = useFetchAllProductsQuery({
    category: category !== 'All' ? category : '',
    color: color !== 'All' ? color : '',
    minPrice: isNaN(minPrice) ? '' : minPrice,
    maxPrice: isNaN(maxPrice) ? '' : maxPrice,
    page: currentPage,
    limit: productsPerPage,
  });

  // Clear filters
  const clearFilters = () => {
    setFiltersState({
      category: 'All',
      color: 'All',
      priceRange: ''
    })
  }

  // handle page chance
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading Products</div>

  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = startProduct + products.length - 1;

  return (
    <>
      <section className='section__container bg-primary-light'>
        <h2 className='section__header capitalize'>Shop Page</h2>
        <p className='section__subheader'>Browse a diverse range of categories, from chic dresses to versatile accessories Elevate your style today</p>
      </section>

      <section className="section__container">
        <div className="flex flex-col md:flex-row md:gap-12 gap-8">
          {/* left side */}
          <ShopFiltering
            filters={filter}
            filtersStates={filtersState}
            setFiltersState={setFiltersState}
            clearFilters={clearFilters}
          />


          {/* right side */}
          <div>
            <h3 className="text-xl font-medium mb-4">
              Showing {startProduct} to {endProduct} of {totalProducts} products
            </h3>
            <ProductCard products={products} />

            {/* pagination controls */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 cursor-pointer"
              >
                Previous
              </button>
              {
                [...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}
                      rounded-md mx-1 cursor-pointer`}
                  >
                    {index + 1}
                  </button>
                ))
              }
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default ShopPage