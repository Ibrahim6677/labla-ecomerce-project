import { Link } from 'react-router-dom'
import RatingStars from '../../components/RatingStars'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'
import { useEffect } from 'react'

const ProductCard = ({ products }) => {
  const dispatch = useDispatch();

  
  const handleAttToCart = (product) => {
    dispatch(addToCart(product))
  }

  useEffect(() => { 
    window.scrollTo(0, 0)
  })


  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
      {
        products.map((product, index) => (
        <div key={index} className='product__card'>
        <div className='relative'>
          <Link to={`/shop/${product._id}`}>
          <img src={product.image} alt="product image" className='max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300'/>
          </Link>
        <div className='hover:block absolute top-3 right-3'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAttToCart(product)
                  }}
                >
            <i className='ri-shopping-cart-2-line bg-primary p-1.5 text-white hover:bg-primary-dark'></i>
          </button>
        </div>
            </div>
            
            {/* product description */}
            <div className='product__card__content'>
              <h4>{product.name}</h4>
              <p>{product.price}  {product.oldPrice ? <s>${product?.oldPrice}</s> : null}</p>
              <RatingStars rating={ product.rating} />
            </div>
        </div>
        ))
      }
    </div>
  )
}
ProductCard.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      oldPrice: PropTypes.number,
      rating: PropTypes.number.isRequired
    })
  ).isRequired
}

export default ProductCard