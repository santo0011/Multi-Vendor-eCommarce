import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// get_admin_orders
export const get_admin_orders = createAsyncThunk(
    'order/get_admin_orders',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/admin/orders?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// get_seller_orders
export const get_seller_orders = createAsyncThunk(
    'order/get_seller_orders',
    async ({ parPage, page, searchValue, sellerId }, { rejectWithValue, fulfillWithValue }) => {

        try {
            const { data } = await api.get(`/home/seller/orders/${sellerId}?page=${page}&searchValue=${searchValue}&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// get_admin_order
export const get_admin_order = createAsyncThunk(
    'order/get_admin_order',
    async (orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/admin/order/${orderId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// get_seller_order
export const get_seller_order = createAsyncThunk(
    'order/get_seller_order',
    async (orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`home/seller/order/${orderId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// admin_order_status_update
export const admin_order_status_update = createAsyncThunk(
    'order/admin_order_status_update',
    async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/home/admin/order-status/update/${orderId}`, info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// seller_order_status_update
export const seller_order_status_update = createAsyncThunk(
    'order/seller_order_status_update',
    async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/home/seller/order-status/update/${orderId}`, info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const OrderReducer = createSlice({
    name: 'order',
    initialState: {
        successMessage: '',
        errorMessage: '',
        totalOrder: 0,
        myOrders: [],
        order: {}
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [get_admin_orders.fulfilled]: (state, { payload }) => {
            state.totalOrder = payload.totalOrder
            state.myOrders = payload.orders
        },
        [get_admin_order.fulfilled]: (state, { payload }) => {
            state.order = payload.order
        },
        [admin_order_status_update.rejected]: (state, { payload }) => {
            state.errorMessage = payload.message
        },
        [admin_order_status_update.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
        },
        [get_seller_orders.fulfilled]: (state, { payload }) => {
            state.totalOrder = payload.totalOrder
            state.myOrders = payload.orders
        },
        [get_seller_order.fulfilled]: (state, { payload }) => {
            state.order = payload.order
        },
        [seller_order_status_update.rejected]: (state, { payload }) => {
            state.errorMessage = payload.message
        },
        [seller_order_status_update.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
        }
    }


});


export const { messageClear } = OrderReducer.actions;
export default OrderReducer.reducer;