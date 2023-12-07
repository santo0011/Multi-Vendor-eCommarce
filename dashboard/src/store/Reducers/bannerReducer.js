import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// categoryAdd
export const add_banner = createAsyncThunk(
    'banner/addBanner',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/banner-add', info, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// categoryReducer
export const bannerReducer = createSlice({
    name: "banner",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        banner: [],
        products: []
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [add_banner.pending]: (state, _) => {

        }
    }
});

export const { messageClear } = bannerReducer.actions;
export default bannerReducer.reducer;