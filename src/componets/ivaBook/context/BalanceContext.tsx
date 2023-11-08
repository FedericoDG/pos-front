import { Dispatch, SetStateAction, createContext } from 'react';

interface Step {
  description: string;
  title: string;
}

export interface Data {
  from: string;
  to: string;
}

interface BalanceContext {
  activeStep: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setActiveStep: (index: number) => void;
  setFrom: Dispatch<SetStateAction<string>>;
  setTo: Dispatch<SetStateAction<string>>;
  steps: Step[];
  from: string;
  to: string;
  data: () => Data;
}

export const balanceContext = createContext({} as BalanceContext);
