import { Dispatch, MutableRefObject, createContext } from 'react';

import { User } from '../interfaces';

interface AppContext {
  bottom: MutableRefObject<null>;
  dispatch: Dispatch<any>;
  handleScroll: (ref: MutableRefObject<HTMLElement | null>) => void;
  isOpenPriceList: boolean;
  isOpenProducts: boolean;
  isOpenStock: boolean;
  onClosePriceList: () => void;
  onCloseProducts: () => void;
  onCloseStock: () => void;
  onTogglePriceList: () => void;
  onToggleProducts: () => void;
  onToggleStock: () => void;
  tableInput: MutableRefObject<any>;
  top: MutableRefObject<null>;
  user: User;
}

export const appContext = createContext({} as AppContext);
