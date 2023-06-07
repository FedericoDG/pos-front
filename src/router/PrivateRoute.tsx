import { Navigate, Outlet } from 'react-router-dom';

import { useMyContext } from '../context';

export const PrivateRoute = () => {
  const {
    user: { logged },
  } = useMyContext();

  return logged ? <Outlet /> : <Navigate to="/" />;
};
