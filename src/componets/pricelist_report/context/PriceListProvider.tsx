import { ReactNode, useContext, useMemo, useState } from 'react';
import { useSteps } from '@chakra-ui/react';

import { priceListContext } from '.';

interface Props {
  children: ReactNode;
}

export const PriceListProvider = ({ children }: Props) => {
  const [productList, setProductList] = useState<number[]>([]);
  const [priceListsList, setPriceListsList] = useState<number[]>([]);
  const [warehousesList, setWarehousesList] = useState<number[]>([]);

  const steps = useMemo(
    () => [
      { title: 'Paso 1', description: 'Productos' },
      { title: 'Paso 2', description: 'Lista de precios' },
      { title: 'Paso 3', description: 'Stock' },
      { title: 'Paso 4', description: 'Generar Reporte' },
    ],
    []
  );

  const { goToNext, goToPrevious, activeStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const values = useMemo(
    () => ({
      activeStep,
      goToNext,
      goToPrevious,
      priceListsList,
      productList,
      setPriceListsList,
      setProductList,
      setWarehousesList,
      steps,
      warehousesList,
    }),
    [activeStep, goToNext, goToPrevious, priceListsList, productList, steps, warehousesList]
  );

  return <priceListContext.Provider value={values}>{children}</priceListContext.Provider>;
};

export const usePriceListContext = () => {
  const {
    activeStep,
    goToNext,
    goToPrevious,
    priceListsList,
    productList,
    setPriceListsList,
    setProductList,
    setWarehousesList,
    steps,
    warehousesList,
  } = useContext(priceListContext);

  return {
    activeStep,
    goToNext,
    goToPrevious,
    priceListsList,
    productList,
    setPriceListsList,
    setProductList,
    setWarehousesList,
    steps,
    warehousesList,
  };
};
