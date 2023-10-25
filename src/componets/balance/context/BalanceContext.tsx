import { Dispatch, SetStateAction, createContext } from 'react';
import { ZodNumberCheck } from 'zod';

interface Step {
  description: string;
  title: string;
}

export interface SelectedUser {
  label: string;
  value: number | undefined;
}

export interface SelectedClient {
  label: string;
  value: number | undefined;
}

export interface SelectedInvoice {
  label: string;
  value: number | undefined;
}

export interface Data {
  userId: number;
  invoices: SelectedInvoice[];
  from: string;
  to: string;
}

interface BalanceContext {
  activeStep: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setActiveStep: (index: number) => void;
  setUser: Dispatch<SetStateAction<SelectedUser | null>>;
  setClient: Dispatch<SetStateAction<SelectedClient | null>>;
  setInvoices: Dispatch<SetStateAction<SelectedInvoice[] | []>>;
  setFrom: Dispatch<SetStateAction<string>>;
  setTo: Dispatch<SetStateAction<string>>;
  steps: Step[];
  user: SelectedUser | null;
  client: SelectedClient | null;
  invoices: SelectedInvoice[] | [];
  from: string;
  to: string;
  data: () => Data;
}

export const balanceContext = createContext({} as BalanceContext);
