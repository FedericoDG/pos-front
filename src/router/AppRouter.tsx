import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import {
  CashRegisterDetails,
  CashRegisterStatus,
  CashRegisters,
  Categories,
  Clients,
  DischargeDetails,
  Discharges,
  GeneratePriceListReport,
  Home,
  LoadCosts,
  LoadDischarges,
  LoadProductTrans,
  LoadPurchase,
  Login,
  Pos,
  PriceListReport,
  PriceLists,
  ProductDetails,
  Products,
  PurchaseDetails,
  Purchases,
  Stocks,
  Suppliers,
  TransferDetails,
  Transfers,
  Units,
  Warehouses,
} from '../pages';

import { PrivateRoute, PublicRoute } from './';

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route element={<PrivateRoute />} path="/panel">
        {/* HOME */}
        <Route index element={<Home />} path="/panel" />
        {/* PRODUCTS */}
        <Route element={<Products />} path="/panel/productos" />
        <Route element={<ProductDetails />} path="/panel/productos/detalles/:id" />
        <Route element={<Categories />} path="/panel/productos/categorias" />
        <Route element={<Units />} path="/panel/productos/unidades" />
        <Route element={<LoadCosts />} path="/panel/productos/costos" />
        {/* STOCK */}
        <Route element={<Stocks />} path="/panel/stock" />
        <Route element={<Purchases />} path="/panel/stock/compras/" />
        <Route element={<PurchaseDetails />} path="/panel/stock/compras/detalles/:id" />
        <Route element={<LoadPurchase />} path="/panel/stock/compras/cargar" />
        <Route element={<Discharges />} path="/panel/stock/bajas" />
        <Route element={<DischargeDetails />} path="/panel/stock/bajas/detalles/:id" />
        <Route element={<LoadDischarges />} path="/panel/stock/bajas/cargar" />
        <Route element={<Warehouses />} path="/panel/stock/depositos" />
        <Route element={<Transfers />} path="/panel/stock/transferencias" />
        <Route element={<TransferDetails />} path="/panel/stock/transferencias/detalles/:id" />
        <Route element={<LoadProductTrans />} path="/panel/stock/transferencias/crear" />
        <Route
          element={<GeneratePriceListReport />}
          path="/panel/lista-de-precios/generar-reporte"
        />
        {/* PRICELISTS */}
        <Route element={<PriceLists />} path="/panel/lista-de-precios/" />
        <Route element={<PriceListReport />} path="/panel/lista-de-precios/reporte" />
        {/* CLIENTS */}
        <Route element={<Clients />} path="/panel/clientes" />
        {/* SUPPLIERS */}
        <Route element={<Suppliers />} path="/panel/proveedores" />
        {/* POS */}
        <Route element={<Pos />} path="/panel/pos" />
        {/* CASH REGISTER */}
        <Route element={<CashRegisters />} path="/panel/caja" />
        <Route element={<CashRegisterStatus />} path="/panel/caja/estado" />
        <Route element={<CashRegisterDetails />} path="/panel/caja/detalles/:id" />
        {/* DEFAULT */}
        <Route element={<Navigate replace to="/panel" />} path="*" />
      </Route>
      <Route element={<PublicRoute />} path="/">
        <Route element={<Login />} path="/" />
      </Route>
    </Routes>
  </Router>
);
