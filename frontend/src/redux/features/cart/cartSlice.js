import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  taxRate: 0.05,
  grandTotal: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExist = state.products.find(product => product._id === action.payload.id);

      if (!isExist) { 
        state.products.push({...action.payload, quantity: 1});
      } else {
        console.log('Product already exists in cart');
      }

      state.selectedItems = setSelectItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
    },
    updateQuantity: (state, action) => {
      const products = state.products.map((product) => {
        if (product._id === action.payload.id) {
          if (action.payload.type === 'increase') {
            product.quantity += 1;
          } else if(action.payload.type === 'decrease') {
            if(product.quantity > 1) {
              product.quantity -= 1;
            }
          }
        }
        return product;
      });
      state.selectedItems = setSelectItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
    },
    removeFromCart: (state, action) => {
      state.products = state.products.filter(product => product._id !== action.payload);
      state.selectedItems = setSelectItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
    },
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;
    }
  }
})

export const setSelectItems = (state) => state.products.reduce((total, product) => {
  return total + product.quantity;
}, 0);

export const setTotalPrice = (state) => state.products.reduce((total, product) => {
  return total + (product.price * product.quantity);
}, 0);

export const setTax = (state) => state.totalPrice * state.taxRate;

export const setGrandTotal = (state) => setTotalPrice(state) + setTotalPrice(state) * state.taxRate;

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
