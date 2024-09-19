import { Dispatch, MutableRefObject, SetStateAction, createContext } from 'react';

import { User } from '../interfaces';

interface AppContext {
  bottom: MutableRefObject<null>;
  dispatch: Dispatch<any>;
  handleScroll: (ref: MutableRefObject<HTMLElement | null>) => void;
  isOpenCashRegister: boolean;
  isOpenPriceList: boolean;
  isOpenProducts: boolean;
  isOpenStock: boolean;
  isOpenCurrentAccount: boolean;
  onClosePriceList: () => void;
  onCloseCashRegister: () => void;
  onCloseProducts: () => void;
  onCloseStock: () => void;
  onCloseCurrentAccount: () => void;
  onTogglePriceList: () => void;
  onToggleCashRegister: () => void;
  onToggleProducts: () => void;
  onToggleStock: () => void;
  onToggleCurrentAccount: () => void;
  tableInput: MutableRefObject<any>;
  top: MutableRefObject<null>;
  user: User;
  responsableInscripto: number | null;
  setResponsableInscripto: Dispatch<SetStateAction<number | null>>;
}

export const appContext = createContext({} as AppContext);
