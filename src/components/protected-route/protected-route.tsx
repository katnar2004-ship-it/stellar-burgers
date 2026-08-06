import { Navigate, Outlet } from 'react-router-dom';
import { RootState, useSelector } from '../../services/store';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  unAuthOnly?: boolean;
  children?: React.ReactNode;
}

export const ProtectedRoute = ({
  unAuthOnly,
  children
}: ProtectedRouteProps) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (unAuthOnly && user) {
    return <Navigate to='/' replace />;
  }

  if (!unAuthOnly && !user) {
    return <Navigate to='/login' replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
