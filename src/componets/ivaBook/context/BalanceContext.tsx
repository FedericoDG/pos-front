import { Dispatch, SetStateAction, createContext } from 'react';

interface Step {
  description: string;
  title: string;
}

export interface SelectedInvoice {
  label: string;
  value: number | undefined;
}

export interface Data {
  invoices: SelectedInvoice[];
  from: string;
  to: string;
}

interface BalanceContext {
  activeStep: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setActiveStep: (index: number) => void;
  setInvoices: Dispatch<SetStateAction<SelectedInvoice[] | []>>;
  setFrom: Dispatch<SetStateAction<string>>;
  setTo: Dispatch<SetStateAction<string>>;
  invoices: SelectedInvoice[] | [];
  steps: Step[];
  from: string;
  to: string;
  data: () => Data;
}

export const balanceContext = createContext({} as BalanceContext);
