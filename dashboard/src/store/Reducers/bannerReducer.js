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


// get_banner
export const get_banner = createAsyncThunk(
    'banner/get_banner',
    async (productId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/banner-get/${productId}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// update_banner
export const update_banner = createAsyncThunk(
    'banner/update_banner',
    async ({ bannerId, info }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/banner-update/${bannerId}`, info, { withCredentials: true });
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
        banner: '',
        products: [],
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [add_banner.pending]: (state, _) => {
            state.loader = true
        },
        [add_banner.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [add_banner.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.banner = payload.banner
        },
        [get_banner.fulfilled]: (state, { payload }) => {
            state.banner = payload.banner
        },
        [update_banner.pending]: (state, _) => {
            state.loader = true
        },
        [update_banner.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [update_banner.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.banner = payload.banner
        }
    }
});


export const { messageClear } = bannerReducer.actions;
export default bannerReducer.reducer;