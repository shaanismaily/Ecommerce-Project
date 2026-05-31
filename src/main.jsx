import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom'

import { ProtectedRoute } from "./components"
import { LoginPage, ProductDetailPage, ProductsPage, RegisterPage, CartPage, CheckoutPage, OrdersPage, OrderDetailPage } from "./pages"

const router = createBrowserRouter(createRoutesFromChildren(
  <Route path='/' element={<App />} >
    <Route 
    path='/login' 
    element={
      <ProtectedRoute authentication={false}>
        <LoginPage />
      </ProtectedRoute>
    }
    />
    <Route 
    path='/signup' 
    element={
      <ProtectedRoute authentication={false}>
        <RegisterPage />
      </ProtectedRoute>
      } 
    />
    <Route path='products' element={<ProductsPage />} />
    <Route path='products/:id' element={<ProductDetailPage />} />
    <Route path='cart' element={<CartPage />} />
    <Route path='checkout' element={<CheckoutPage />} />
    <Route path='orders' element={<OrdersPage />} />
    <Route path='orders/:id' element={<OrderDetailPage />} />
  </Route>
))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
