import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// categoryAdd
export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formDate = new FormData();
            formDate.append('name', name)
            formDate.append('image', image)
            const { data } = await api.post('/category-add', formDate, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// get_category
export const get_category = createAsyncThunk(
    'category/get_category',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// categoryReducer
export const categoryReducer = createSlice({
    name: "category",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        categorys: [],
        totalCategory: 0

    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [categoryAdd.pending]: (state, _) => {
            state.loader = true
        },
        [categoryAdd.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [categoryAdd.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.categorys = [...state.categorys, payload.category]
        },
        [get_category.fulfilled]: (state, { payload }) => {
            state.totalCategory = payload.totalCategory
            state.categorys = payload.categorys
        }
    }
});

export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;