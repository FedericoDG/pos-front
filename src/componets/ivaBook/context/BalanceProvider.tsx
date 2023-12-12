import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useSteps } from '@chakra-ui/react';

import { SelectedInvoice, balanceContext } from '.';

interface Props {
  children: ReactNode;
}

export const BalanceProvider = ({ children }: Props) => {
  const [invoices, setInvoices] = useState<SelectedInvoice[] | []>([]);
  const [from, setFrom] = useState<string>(new Date().toISOString().split('T')[0]);
  const [to, setTo] = useState<string>(new Date().toISOString().split('T')[0]);

  const data = useCallback(
    () => ({
      invoices: invoices,
      from: from,
      to: to,
    }),
    [from, invoices, to]
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
      invoices,
      setInvoices,
    }),
    [activeStep, data, from, goToNext, goToPrevious, invoices, setActiveStep, steps, to]
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
    invoices,
    setInvoices,
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
    invoices,
    setInvoices,
  };
};
