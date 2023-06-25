import { ReactNode, useContext, useMemo, useState } from 'react';
import { useSteps } from '@chakra-ui/react';

import { CartItem, SelectedSupplier, SelectedWarehouse, purchasesContext } from '.';

interface Props {
  children: ReactNode;
}

export const PurchasesProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [supplier, setSupplier] = useState<SelectedSupplier | null>({} as SelectedSupplier);
  const [warehouse, setWarehouse] = useState<SelectedWarehouse | null>({} as SelectedWarehouse);
  const [transport, setTransport] = useState('');
  const [driver, setDriver] = useState('');

  const addItem = (product: CartItem) => {
    setCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map((item) => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + product.quantity, price: product.price };
          }

          return item;
        });

        return updatedItems;
      }

      return [...currentItems, { ...product }];
    });
  };

  const removeItem = (id: number) => {
    return setCart((currentItems) => [...currentItems.filter((item) => item.id !== id)]);
  };

  const emptyCart = () => {
    return setCart([]);
  };

  const totalCart = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity * item.price, 0),
    [cart]
  );

  const totalCartItems = useMemo(() => cart.length, [cart]);

  const steps = useMemo(
    () => [
      { title: 'Paso 1', description: 'Proveedor y Depósito' },
      { title: 'Paso 2', description: 'Transporte y Chofer' },
      { title: 'Paso 3', description: 'Cargar Compra' },
    ],
    []
  );

  const { goToNext, goToPrevious, activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const values = useMemo(
    () => ({
      activeStep,
      addItem,
      cart,
      driver,
      emptyCart,
      goToNext,
      goToPrevious,
      removeItem,
      setActiveStep,
      setDriver,
      setSupplier,
      setTransport,
      setWarehouse,
      steps,
      supplier,
      totalCart,
      totalCartItems,
      transport,
      warehouse,
    }),
    [
      activeStep,
      cart,
      driver,
      goToNext,
      goToPrevious,
      setActiveStep,
      steps,
      supplier,
      totalCart,
      totalCartItems,
      transport,
      warehouse,
    ]
  );

  return <purchasesContext.Provider value={values}>{children}</purchasesContext.Provider>;
};

export const usePurchasesContext = () => {
  const {
    activeStep,
    addItem,
    cart,
    driver,
    emptyCart,
    goToNext,
    goToPrevious,
    removeItem,
    setActiveStep,
    setDriver,
    setSupplier,
    setTransport,
    setWarehouse,
    steps,
    supplier,
    totalCart,
    totalCartItems,
    transport,
    warehouse,
  } = useContext(purchasesContext);

  return {
    activeStep,
    addItem,
    cart,
    driver,
    emptyCart,
    goToNext,
    goToPrevious,
    removeItem,
    setActiveStep,
    setDriver,
    setSupplier,
    setTransport,
    setWarehouse,
    steps,
    supplier,
    totalCart,
    totalCartItems,
    transport,
    warehouse,
  };
};
