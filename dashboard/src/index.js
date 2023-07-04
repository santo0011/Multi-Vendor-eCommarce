import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast'
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
const App = lazy(() => import('./App'));
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback="Loading...">
        <App />
        <Toaster
          toastOptions={{
            position: 'top-right',
            style: {
              background: '#283046',
              color: 'white'
            }
          }}
        />
      </Suspense>
    </Provider>
  </BrowserRouter>
);

reportWebVitals();