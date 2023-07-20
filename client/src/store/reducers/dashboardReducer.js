import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// get_dashboard_index_data
export const get_dashboard_index_data = createAsyncThunk(
    'dashboard/get_dashboard_index_data',
    async (userId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-dashboard-data/${userId}`);
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState: {
        recentOrders: [],
        errorMessage: '',
        successMessage: '',
        totalOrder: 0,
        pendingOrder: 0,
        cancelledOrder: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: {
        [get_dashboard_index_data.fulfilled]: (state, { payload }) => {
            state.recentOrders = payload.recentOrders
            state.pendingOrder = payload.pendingOrder
            state.totalOrder = payload.totalOrder
            state.cancelledOrder = payload.cancelledOrder
        }
    }
});


export const { messageClear } = dashboardReducer.actions;

export default dashboardReducer.reducer;