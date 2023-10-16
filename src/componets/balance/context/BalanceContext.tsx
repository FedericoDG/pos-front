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

export interface SelectedPayment {
  label: string;
  value: number | undefined;
}

export interface Data {
  userId: number;
  paymentMethodId: number;
  from: string;
  to: string;
}

interface BalanceContext {
  activeStep: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setActiveStep: (index: number) => void;
  setUser: Dispatch<SetStateAction<SelectedUser | null>>;
  setPayment: Dispatch<SetStateAction<SelectedPayment | null>>;
  setFrom: Dispatch<SetStateAction<string>>;
  setTo: Dispatch<SetStateAction<string>>;
  steps: Step[];
  user: SelectedUser | null;
  payment: SelectedPayment | null;
  from: string;
  to: string;
  data: () => Data;
}

export const balanceContext = createContext({} as BalanceContext);
