import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App'
import store from './store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="1099175367435-gmv2kdermek9so9ma5a5fnt4ssfhsh41.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </Provider>,
)
