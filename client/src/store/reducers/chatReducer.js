import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// add_friend
export const add_friend = createAsyncThunk(
    'chat/add_friend',
    async (info, { fulfillWithValue, rejectWithValue }) => {

        try {
            const { data } = await api.post('/chat/customer/add-customer-friend', info)

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// send_message
export const send_message = createAsyncThunk(
    'chat/send_message',
    async (info, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.post('/chat/customer/send-message-to-seller', info)

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        my_friends: [],
        fd_messages: [],
        currentFd: "",
        successMessage: ""
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        },
        updateMessage: (state, { payload }) => {
            state.fd_messages = [...state.fd_messages, payload]
        }
    },
    extraReducers: {
        [add_friend.fulfilled]: (state, { payload }) => {
            state.fd_messages = payload.message
            state.currentFd = payload.currentFd
            state.my_friends = payload.myFriends
        },
        [send_message.fulfilled]: (state, { payload }) => {
            let tempFriends = state.my_friends
            let index = tempFriends.findIndex(f => f.fdId === payload.message.receverId)
            while (index > 0) {
                let temp = tempFriends[index]
                tempFriends[index] = tempFriends[index - 1]
                tempFriends[index - 1] = temp
                index--
            }
            state.my_friends = tempFriends
            state.fd_messages = [...state.fd_messages, payload.message]
            state.successMessage = 'Message send success'
        }
    }
});


export const { messageClear, updateMessage } = chatReducer.actions;
export default chatReducer.reducer;
