import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { CategoryList, Home, Login, Products } from '../pages';

import { PrivateRoute, PublicRoute } from './';

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route element={<PrivateRoute />} path="/panel">
        <Route index element={<Home />} path="/panel" />
        <Route index element={<Products />} path="/panel/productos" />
        <Route element={<CategoryList />} path="/panel/categorias" />
        <Route element={<Navigate replace to="/panel" />} path="*" />
      </Route>
      <Route element={<PublicRoute />} path="/">
        <Route element={<Login />} path="/" />
      </Route>
    </Routes>
  </Router>
);
