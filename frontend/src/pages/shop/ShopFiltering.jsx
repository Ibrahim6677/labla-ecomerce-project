import 'react'
import PropTypes from 'prop-types'

const ShopFiltering = ({filters, filtersStates, setFiltersState, clearFilters}) => {
  return (
    <div className='space-y-5 flex-shrink-0'>
      <h3>Filters</h3>

      {/* Category */}
      <div className='flex flex-col space-y-2'>
        <h4 className='font-medium text-lg'>Category</h4>
        <hr />
        {
          filters.categories.map((category) => (
            <label key={category} className='capitalize cursor-pointer'>
              <input type="radio" name='category' id='category' value={category}
              checked={filtersStates.category === category}
              onChange={(e) => setFiltersState({...filtersStates, category: e.target.value})}
              />
              <span className='ml-1'>{ category }</span>
            </label>
          ))
        }
      </div>

      {/* Color */}
      <div className='flex flex-col space-y-2'>
        <h4 className='font-medium text-lg'>Color</h4>
        <hr />
        {
          filters.colors.map((color) => (
            <label key={color} className='capitalize cursor-pointer'>
              <input type="radio" name='color' id='color' value={color}
              checked={filtersStates.color === color}
              onChange={(e) => setFiltersState({...filtersStates, color: e.target.value})}
              />
              <span className='ml-1'>{ color }</span>
            </label>
          ))
        }
      </div>

      {/* Price */}
      <div className='flex flex-col space-y-2'>
        <h4 className='font-medium text-lg'>Price Range</h4>
        <hr />
        {
          filters.priceRanges.map((rang) => (
            <label key={rang.label} className='capitalize cursor-pointer'>
              <input type="radio" name='priceRange' id='priceRange'
                value={`${rang.min}-${rang.max}`}
              checked={filtersStates.priceRange === `${rang.min}-${rang.max}`}
              onChange={(e) => setFiltersState({...filtersStates, priceRange: e.target.value})}
              />
              <span className='ml-1'>{ rang.label }</span>
            </label>
          ))
        }
      </div>
      
      {/* Clear filters */}
      <button onClick={clearFilters}
        className='bg-primary py-1 px-4 text-white rounded'>Clear All Filters</button>
    </div>
  )
}
ShopFiltering.propTypes = {
  filters: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    priceRanges: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  filtersStates: PropTypes.object.isRequired,
  setFiltersState: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
}

export default ShopFiltering