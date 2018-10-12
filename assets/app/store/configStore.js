import { applyMiddleware, createStore, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

const enhancers = [];
const middleware = [thunk];

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

// TODO: Can add additional enhancers for dev env

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
);

export default () => {
    const store = createStore(persistedReducer, composedEnhancers);
    return { store, persistor: persistStore(store) };
};
