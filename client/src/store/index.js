import { configureStore } from '@reduxjs/toolkit';
import rootReducers from './rootReducer';

const store = configureStore({
    reducer: rootReducers,
    devTools: true,
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
            serializableCheck: false
        })
    }
});


export default store;