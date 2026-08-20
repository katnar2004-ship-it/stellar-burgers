import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import burgerConstructorSlice from './slices/constructorSlice';
import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';
import profileOrdersReducer from './slices/profileOrderSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  burgers: burgerConstructorSlice,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
