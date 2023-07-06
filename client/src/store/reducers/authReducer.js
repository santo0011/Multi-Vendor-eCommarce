import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// customer_register
export const customer_register = createAsyncThunk(
    'auth/customer_register',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/customer/customer-register', info);

            console.log(data)

        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        loader: false,
        userInfo: '',
        errorMessage: '',
        successMessage: ''
    },
    reducers: {

    },
    extraReducers: {

    }
});

export default authReducer.reducer;