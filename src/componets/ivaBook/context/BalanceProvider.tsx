import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useSteps } from '@chakra-ui/react';

import { balanceContext } from '.';

interface Props {
  children: ReactNode;
}

export const BalanceProvider = ({ children }: Props) => {
  const [from, setFrom] = useState<string>(new Date().toISOString().split('T')[0]);
  const [to, setTo] = useState<string>(new Date().toISOString().split('T')[0]);

  const data = useCallback(
    () => ({
      from: from,
      to: to,
    }),
    [from, to]
  );

  const steps = useMemo(
    () => [
      { title: 'Paso 1', description: 'Aplicar filtros' },
      { title: 'Paso 2', description: 'Obtener informe' },
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
      goToNext,
      goToPrevious,
      setActiveStep,
      steps,
      from,
      setFrom,
      to,
      setTo,
      data,
    }),
    [activeStep, data, from, goToNext, goToPrevious, setActiveStep, steps, to]
  );

  return <balanceContext.Provider value={values}>{children}</balanceContext.Provider>;
};

export const useBalanceContext = () => {
  const {
    activeStep,
    goToNext,
    goToPrevious,
    setActiveStep,
    steps,
    from,
    setFrom,
    to,
    setTo,
    data,
  } = useContext(balanceContext);

  return {
    activeStep,
    goToNext,
    goToPrevious,
    setActiveStep,
    steps,
    from,
    setFrom,
    to,
    setTo,
    data,
  };
};
