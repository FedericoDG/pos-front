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
      productList,
      setProductList,
      priceListsList,
      setPriceListsList,
      warehousesList,
      setWarehousesList,
      activeStep,
      goToNext,
      goToPrevious,
      steps,
    }),
    [activeStep, goToNext, goToPrevious, priceListsList, productList, steps, warehousesList]
  );

  return <priceListContext.Provider value={values}>{children}</priceListContext.Provider>;
};

export const usePriceListContext = () => {
  const {
    productList,
    setProductList,
    priceListsList,
    setPriceListsList,
    warehousesList,
    setWarehousesList,
    activeStep,
    goToNext,
    goToPrevious,
    steps,
  } = useContext(priceListContext);

  return {
    productList,
    setProductList,
    priceListsList,
    setPriceListsList,
    warehousesList,
    setWarehousesList,
    activeStep,
    goToNext,
    goToPrevious,
    steps,
  };
};
