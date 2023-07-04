import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../api/api';


// get_category
export const get_category = createAsyncThunk(
    'product/get_category',
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get('/home/get-categorys');
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error)
        }
    }
)

// get_products
export const get_products = createAsyncThunk(
    'product/get_products',
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get('/home/get-products')
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)

// price_range_product
export const price_range_product = createAsyncThunk(
    'product/price_range_product',
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get('/home/price-range-latest-product')
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)


// query_products
export const query_products = createAsyncThunk(
    'product/query_products',
    async (query, { fulfillWithValue }) => {
        const { category, high, low, pageNumber, rating, sortPrice } = query;
        try {
            const { data } = await api.get(`/home/query-products?category=${category}&&rating=${rating}&&lowPrice=${low}&&highPrice=${high}&&sortPrice=${sortPrice}&&pageNumber=${pageNumber}&&searchValue=${query.searchValue ? query.searchValue : ""} `);

            console.log(data)

            return fulfillWithValue(data);
        } catch (error) {
            console.log(error.response)
        }
    }
)


export const homeReducer = createSlice({
    name: "home",
    initialState: {
        categorys: [],
        products: [],
        totalProduct: 0,
        parPage: 4,
        latest_product: [],
        topRated_product: [],
        discount_product: [],
        priceRange: {
            low: 0,
            high: 100
        }
    },
    reducers: {

    },
    extraReducers: {
        [get_category.fulfilled]: (state, { payload }) => {
            state.categorys = payload.categorys
        },
        [get_products.fulfilled]: (state, { payload }) => {
            state.products = payload.products
            state.latest_product = payload.latest_product
            state.topRated_product = payload.topRated_product
            state.discount_product = payload.discount_product
        },
        [price_range_product.fulfilled]: (state, { payload }) => {
            state.latest_product = payload.latest_product
            state.priceRange = payload.priceRange
        },
        [query_products.fulfilled]: (state, { payload }) => {

        }
    }
});


export default homeReducer.reducer;