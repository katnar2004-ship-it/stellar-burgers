import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('обработка неизвестного экшена', () => {
    const action = { type: 'UNKNOWN' };
    const state = burgerConstructorSlice.reducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  test('обработка addIngredient (булка)', () => {
    const mockBun = {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      price: 100,
      id: 'mock-id-1'
    } as TConstructorIngredient;

    const action = {
      type: addIngredient.type,
      payload: mockBun
    };

    const state = burgerConstructorSlice.reducer(initialState, action);

    expect(state).toEqual({
      bun: mockBun,
      ingredients: []
    });
  });

  test('обработка addIngredient (начинка)', () => {
    const mockMain = {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      price: 50,
      id: 'mock-id-2'
    } as TConstructorIngredient;

    const action = {
      type: addIngredient.type,
      payload: mockMain
    };

    const state = burgerConstructorSlice.reducer(initialState, action);

    expect(state).toEqual({
      bun: null,
      ingredients: [mockMain]
    });
  });

  test('обработка removeIngredient', () => {
    const mockMain = {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      price: 50,
      id: 'mock-id-2'
    } as TConstructorIngredient;

    const stateWithIngredient = {
      bun: null,
      ingredients: [mockMain]
    };

    const action = {
      type: removeIngredient.type,
      payload: 'mock-id-2'
    };

    const state = burgerConstructorSlice.reducer(stateWithIngredient, action);

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('обработка moveIngredient', () => {
    const mockIngredient1 = {
      _id: '2',
      name: 'Начинка 1',
      type: 'main',
      price: 50,
      id: 'mock-id-2'
    } as TConstructorIngredient;

    const mockIngredient2 = {
      _id: '3',
      name: 'Начинка 2',
      type: 'main',
      price: 60,
      id: 'mock-id-3'
    } as TConstructorIngredient;

    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2]
    };

    const action = {
      type: moveIngredient.type,
      payload: { from: 0, to: 1 }
    };

    const state = burgerConstructorSlice.reducer(stateWithIngredients, action);

    expect(state).toEqual({
      bun: null,
      ingredients: [mockIngredient2, mockIngredient1]
    });
  });

  test('обработка clearConstructor', () => {
    const mockBun = {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      price: 100,
      id: 'mock-id-1'
    } as TConstructorIngredient;

    const mockMain = {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      price: 50,
      id: 'mock-id-2'
    } as TConstructorIngredient;

    const filledState = {
      bun: mockBun,
      ingredients: [mockMain]
    };

    const action = { type: clearConstructor.type };

    const state = burgerConstructorSlice.reducer(filledState, action);

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});