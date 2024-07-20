import { Dispatch, SetStateAction, createContext } from 'react';

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
  from: string;
  to: string;
}

interface CurrentAccountContext {
  activeStep: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setActiveStep: (index: number) => void;
  setClient: Dispatch<SetStateAction<SelectedClient | null>>;
  setFrom: Dispatch<SetStateAction<string>>;
  setTo: Dispatch<SetStateAction<string>>;
  steps: Step[];
  client: SelectedClient | null;
  from: string;
  to: string;
  data: () => Data;
}

export const currentAccountContext = createContext({} as CurrentAccountContext);
