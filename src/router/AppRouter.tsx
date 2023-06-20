import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import {
  Categories,
  Clients,
  GeneratePriceListReport,
  Home,
  Login,
  PriceListReport,
  ProductDetails,
  Products,
  Purchases,
  Stocks,
  Suppliers,
  Units,
  Warehouses,
} from '../pages';
import { StepperA } from '../pages/Stepper';

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
        <Route element={<Warehouses />} path="/panel/depositos" />
        <Route element={<Suppliers />} path="/panel/proveedores" />
        <Route
          element={<GeneratePriceListReport />}
          path="/panel/lista-de-precios/generar-reporte"
        />
        <Route element={<PriceListReport />} path="/panel/lista-de-precios/reporte" />
        {/*  <Route element={<Purchases />} path="/panel/compras" /> */}
        <Route element={<StepperA />} path="/panel/compras" />
        <Route element={<Stocks />} path="/panel/stock" />
        <Route element={<Navigate replace to="/panel" />} path="*" />
      </Route>
      <Route element={<PublicRoute />} path="/">
        <Route element={<Login />} path="/" />
      </Route>
    </Routes>
  </Router>
);
