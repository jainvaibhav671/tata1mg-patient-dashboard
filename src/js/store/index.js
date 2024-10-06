import { configureStore as createStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import { shellReducer } from "./reducers/reducer.js"

import { prescriptionApi } from "./api/prescriptions"
import { authApi } from "./api/auth"
import { storageApi } from "./api/storage"

import fetchInstance from "@api"

/**
 * Function that initializes the store with the initialstate and adds middlewares that can be used during action dispatch
 * @param    {object} initialState    Default state
 * @param    {object} request   Request object that we recieve on server, this is only recieved when store is initialized on the server.
 * @return   {object} The store itself
 */

const configureStore = (initialState) => {
    const api = fetchInstance
    const store = createStore({
        reducer: {
            shellReducer,
            [prescriptionApi.reducerPath]: prescriptionApi.reducer,
            [authApi.reducerPath]: authApi.reducer,
            [storageApi.reducerPath]: storageApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: { api },
                },
            })
                .concat(prescriptionApi.middleware)
                .concat(authApi.middleware)
                .concat(storageApi.middleware),
        preloadedState: initialState,
    })
    return store
}

export default configureStore
