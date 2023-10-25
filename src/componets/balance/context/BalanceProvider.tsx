import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useSteps } from '@chakra-ui/react';

import { SelectedUser, balanceContext, SelectedClient, SelectedInvoice } from '.';

interface Props {
  children: ReactNode;
}

export const BalanceProvider = ({ children }: Props) => {
  const [user, setUser] = useState<SelectedUser | null>({ value: 0, label: 'TODOS' });
  const [client, setClient] = useState<SelectedClient | null>({ value: 0, label: 'TODOS' });
  const [invoices, setInvoices] = useState<SelectedInvoice[] | []>([]);
  const [from, setFrom] = useState<string>(new Date().toISOString().split('T')[0]);
  const [to, setTo] = useState<string>(new Date().toISOString().split('T')[0]);

  const data = useCallback(
    () => ({
      userId: user?.value || 0,
      invoices: invoices,
      from: from,
      to: to,
    }),
    [from, invoices, to, user?.value]
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
      setUser,
      steps,
      user,
      from,
      setFrom,
      to,
      setTo,
      data,
      client,
      setClient,
      invoices,
      setInvoices,
    }),
    [
      activeStep,
      goToNext,
      goToPrevious,
      setActiveStep,
      steps,
      user,
      from,
      to,
      data,
      client,
      invoices,
    ]
  );

  return <balanceContext.Provider value={values}>{children}</balanceContext.Provider>;
};

export const useBalanceContext = () => {
  const {
    activeStep,
    goToNext,
    goToPrevious,
    setActiveStep,
    setUser,
    steps,
    user,
    from,
    setFrom,
    to,
    setTo,
    data,
    client,
    setClient,
    invoices,
    setInvoices,
  } = useContext(balanceContext);

  return {
    activeStep,
    goToNext,
    goToPrevious,
    setActiveStep,
    setUser,
    steps,
    user,
    from,
    setFrom,
    to,
    setTo,
    data,
    client,
    setClient,
    invoices,
    setInvoices,
  };
};
