import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
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
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (unAuthOnly && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (!unAuthOnly && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
