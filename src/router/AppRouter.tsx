import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { Categories, Clients, Home, Login, ProductDetails, Products, Units } from '../pages';

import { PrivateRoute, PublicRoute } from './';

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route element={<PrivateRoute />} path="/panel">
        <Route index element={<Home />} path="/panel" />
        <Route element={<Products />} path="/panel/productos" />
        <Route element={<ProductDetails />} path="/panel/productos/:id" />
        <Route element={<Categories />} path="/panel/categorias" />
        <Route element={<Units />} path="/panel/unidades" />
        <Route element={<Clients />} path="/panel/clientes" />
        <Route element={<Navigate replace to="/panel" />} path="*" />
      </Route>
      <Route element={<PublicRoute />} path="/">
        <Route element={<Login />} path="/" />
      </Route>
    </Routes>
  </Router>
);
