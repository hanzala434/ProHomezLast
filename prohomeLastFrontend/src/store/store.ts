import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice.ts';
import postsReducer from '../features/posts/postsSlice.ts';

const store = configureStore({
  reducer: {
    products: productReducer,
    posts: postsReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
