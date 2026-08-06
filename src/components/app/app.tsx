import '../../index.css';
import styles from './app.module.css';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';

import { ProtectedRoute } from '../protected-route';
import { AppHeader, Modal } from '@components';
import { Preloader } from '@ui';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { OrderInfo, IngredientDetails } from '@components';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background || location;

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );
  const error = useSelector((state) => state.ingredients.error);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route
          path='/'
          element={
            isIngredientsLoading ? (
              <Preloader />
            ) : error ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {error}
              </div>
            ) : ingredients.length > 0 ? (
              <ConstructorPage />
            ) : (
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Нет игредиентов
              </div>
            )
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute unAuthOnly>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute unAuthOnly>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      <Routes>
        <Route
          path='/ingredients/:id'
          element={
            <Modal title={'Описание ингредиента'} onClose={() => navigate(-1)}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Modal title={'Заказ'} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <Modal title={'Заказ'} onClose={() => navigate(-1)}>
              <OrderInfo />
            </Modal>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
