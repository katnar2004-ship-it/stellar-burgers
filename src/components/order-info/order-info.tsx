import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { getOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);
  const orderFromStore = useSelector((state) => state.order.order);
  const error = useSelector((state) => state.order.error);

  const orderData =
    feedOrders.find((order: TOrder) => order.number === Number(number)) ||
    profileOrders.find((order: TOrder) => order.number === Number(number)) ||
    orderFromStore;

  useEffect(() => {
    if (!orderData && number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, orderData, number]);

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
