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

            console.log(data)

            return true
        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data)
        }
    }
)


export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        myOders: [],
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

    }
})


export const { messageClear } = orderReducer.actions
export default orderReducer.reducer;