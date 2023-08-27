import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'


// get_customers
export const get_customers = createAsyncThunk(
    'chat/get_customers',
    async (sellerId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/chat/seller/get-customers/${sellerId}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// get_customer_message
export const get_customer_message = createAsyncThunk(
    'chat/get_customer_message',
    async (customerId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/chat/seller/get-customer-message/${customerId}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// send_message
export const send_message = createAsyncThunk(
    'chat/send_message',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/chat/seller/send-message-to-customer`, info, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const chatReducer = createSlice({
    name: 'seller',
    initialState: {
        successMessage: '',
        errorMessage: '',
        customers: [],
        messages: [],
        currentCustomer: {}
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        },
        updateMessage: (state, { payload }) => {
            state.messages = [...state.messages, payload]
        }
    },
    extraReducers: {
        [get_customers.fulfilled]: (state, { payload }) => {
            state.customers = payload.customers
        },
        [get_customer_message.fulfilled]: (state, { payload }) => {
            state.messages = payload.messages
            state.currentCustomer = payload.currentCustomer
        },
        [send_message.fulfilled]: (state, { payload }) => {
            let tempFriends = state.customers;
            let index = tempFriends.findIndex(f => f.fbId === payload.message.receverId);

            while (index > 0) {
                let temp = tempFriends[index]
                tempFriends[index] = tempFriends[index - 1]
                tempFriends[index - 1] = temp
                index--
            }

            state.customers = tempFriends
            state.messages = [...state.messages, payload.message]
            state.successMessage = "Message send success"
        }
    }

});


export const { messageClear, updateMessage } = chatReducer.actions;
export default chatReducer.reducer;