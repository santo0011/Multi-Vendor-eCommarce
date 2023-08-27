import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// place_order
export const place_order = createAsyncThunk(
    'order/place_order',
    async ({ price, products, shipping_fee, shippingInfo, userId, navigate, items }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/home/order/palce-order', { price, products, shipping_fee, shippingInfo, userId, navigate, items });

            navigate('/payment', {
                state: {
                    price: price + shipping_fee,
                    items,
                    orderId: data.orderId
                }
            });

            return true
        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data)
        }
    }
)


// get_orders
export const get_orders = createAsyncThunk(
    'order/get_orders',
    async ({ customerId, status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-orders/${customerId}/${status}`);
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.message)
        }
    }
)

// get_order
export const get_order = createAsyncThunk(
    'order/get_order',
    async (orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-order/${orderId}`);
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.message)
        }
    }
)



export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        myOrders: [],
        errorMessage: '',
        successMessage: '',
        myOrder: {}
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: {
        [get_orders.fulfilled]: (state, { payload }) => {
            state.myOrders = payload.orders
        },
        [get_order.fulfilled]: (state, { payload }) => {
            state.myOrder = payload.order
        }
    }
});


export const { messageClear } = orderReducer.actions
export default orderReducer.reducer;