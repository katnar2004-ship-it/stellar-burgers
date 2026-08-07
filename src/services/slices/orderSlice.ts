import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  order: TOrder | null;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
  order: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsIds: string[]) => {
    const data = await orderBurgerApi(ingredientsIds);
    return { ...data.order, ingredients: ingredientsIds };
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      if (response?.success && response.orders?.length > 0) {
        return response.orders[0];
      }
      return rejectWithValue('Заказ не найден');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки заказа');
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderModalData, clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
