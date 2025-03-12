import { createSlice } from "@reduxjs/toolkit";

// تحميل المستخدم من localStorage
const loadUserFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('user');
    return serializedState ? { user: JSON.parse(serializedState) } : { user: null };
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
    return { user: null };
  }
};

// تعيين الحالة الابتدائية
const initialState = loadUserFromLocalStorage() || { user: null };

// إنشاء Slice لإدارة حالة المصادقة
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload?.user) {
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    }
  }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
