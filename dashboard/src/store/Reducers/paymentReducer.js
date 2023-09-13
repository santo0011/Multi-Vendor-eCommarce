import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// get_seller_payemt_details
export const get_seller_payemt_details = createAsyncThunk(
    'payment/get_seller_payemt_details',
    async (sellerId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/payment/seller-payment-details/${sellerId}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// send_withdrowal_request
export const send_withdrowal_request = createAsyncThunk(
    'payment/send_withdrowal_request',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/payment/withdrowal-request`, info, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// get_payment_request
export const get_payment_request = createAsyncThunk(
    'payment/get_payment_request',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/payment/request`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// confirm_payment_request
export const confirm_payment_request = createAsyncThunk(
    'payment/confirm_payment_request',
    async (paymentId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/payment/request-confirm`, { paymentId }, { withCredentials: true });

            console.log(data)

            // return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const paymentReducer = createSlice({
    name: 'payment',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        pendingWithdrows: [],
        successWithdrows: [],
        totalAmount: 0,
        withdrowAmount: 0,
        pendingAmount: 0,
        availableAmount: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [get_seller_payemt_details.fulfilled]: (state, { payload }) => {
            state.pendingWithdrows = payload.pendingWithdrows
            state.successWithdrows = payload.successWithdrows
            state.totalAmount = payload.totalAmount
            state.withdrowAmount = payload.withdrowAmount
            state.pendingAmount = payload.pendingAmount
            state.availableAmount = payload.availableAmount
        },
        [send_withdrowal_request.pending]: (state, _) => {
            state.loader = true
        },
        [send_withdrowal_request.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [send_withdrowal_request.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [get_payment_request.fulfilled]: (state, { payload }) => {
            state.pendingWithdrows = payload.withdrowalRequest
        }
    }

});


export const { messageClear } = paymentReducer.actions;
export default paymentReducer.reducer;