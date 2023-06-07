import { Navigate, Outlet } from 'react-router-dom';

import { useMyContext } from '../context';

export const PublicRoute = () => {
  const {
    user: { logged },
  } = useMyContext();

  return logged ? <Navigate to="/panel/" /> : <Outlet />;
};
