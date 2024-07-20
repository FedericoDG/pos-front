import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useSteps } from '@chakra-ui/react';

import { currentAccountContext, SelectedClient } from '.';

interface Props {
  children: ReactNode;
}

export const CurrentAccountProvider = ({ children }: Props) => {
  const [client, setClient] = useState<SelectedClient | null>(null);
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
      client,
      setClient,
    }),
    [activeStep, goToNext, goToPrevious, setActiveStep, steps, from, to, data, client]
  );

  return <currentAccountContext.Provider value={values}>{children}</currentAccountContext.Provider>;
};

export const useCurrentAccountContext = () => {
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
    client,
    setClient,
  } = useContext(currentAccountContext);

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
    client,
    setClient,
  };
};
