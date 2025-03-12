import 'react'
import PropTypes from 'prop-types'
import OrderSummary from './OrderSummary'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice'

const CartModel = ({ products, isOpen, onClose }) => {
  const dispatch = useDispatch()

  const handleQuantity = (type, id) => {
    dispatch(updateQuantity({type, id}))
  }
  const handleRemove = (id) => {
    dispatch(removeFromCart(id))
  }
  return (
    <div className={`fixed z-[1000] inset-0 bg-black bg-opacity-80 transition-opacity 
      ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    style={{transition: 'opacity 300ms ease-in-out'}}
    >
      <div className={`fixed right-0 top-0 md:w-1/3 w-full bg-white h-full overflow-y-auto
        transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{transition: 'transform 300ms cubic-bezier(0.25, .46, 0.45, .94)'}}
      >
        <div className='p-4 mt-4'>
          <div className='flex justify-between items-center mb-4'>
          <h4 className='text-xl font-semibold'>Your Cart</h4>
          <button
            onClick={() => onClose()}
            className='text-gray-600 hover:text-gray-900'>
            <i className='ri-xrp-fill bg-black p-1 text-white'></i>
          </button>
          </div>

          {/* Cart Details */}
          <div className='cart-items'>
            {
              products.length === 0 ? (<div>Your Cart is empty</div>) : (

                  products.map((item, index) => (
                    <div key={index} className='flex flex-col md:flex-row md:items-center
                    md:justify-between  shadow-md md:p-5 p-2 mb-4'>
                      <div className='flex items-center'>
                        <span className='mr-4 px-1 bg-primary text-white 
                        rounded-full'>0{index + 1}</span>
                        <img src={item.image} alt="" className='size-12 
                        object-cover mr-4'/>
                        <div>
                          <h5 className='text-lg font-medium'>{item.name}</h5>
                          <p className='text-gray-600 text-sm'>${Number(item.price).toFixed(2)}</p>
                        </div>

                        <div className='flex flex-row md:justify-end items-center mt-2'>
                          <button
                            onClick={() => handleQuantity('decrease', item.id)}
                            className='size-6 flex items-center justify-center px-1.5 bg-gray-200 
                          text-gray-700 hover:bg-primary hover:text-white ml-8 rounded-full'
                          >-</button>
                          <span className='px-2 text-center mx-1'>{item.quantity}</span>
                          <button
                            onClick={() => handleQuantity('increase', item._id)}
                          className='size-6 flex items-center justify-center px-1.5 bg-gray-200 
                          text-gray-700 hover:bg-primary hover:text-white rounded-full'
                          >+</button>
                          <div className='ml-5'>
                            <button
                              onClick={() => handleRemove(item._id)}
                            className='text-red-500 hover:text-red-800'
                            >Remove</button>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  ))
              )
            }
          </div>

          {/* Calculation */}
          {
            products.length > 0 && (
              <OrderSummary />
            )
          }
          
        </div>
      </div>
    </div>
  )
}
CartModel.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  })).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default CartModel