import { Dispatch, MutableRefObject, createContext } from 'react';

import { User } from '../interfaces';

interface AppContext {
  top: MutableRefObject<null>;
  bottom: MutableRefObject<null>;
  tableInput: MutableRefObject<any>;
  handleScroll: (ref: MutableRefObject<HTMLElement | null>) => void;
  dispatch: Dispatch<any>;
  user: User;
  isOpenProducts: boolean;
  isOpenPriceList: boolean;
  isOpenStock: boolean;
  onToggleProducts: () => void;
  onCloseProducts: () => void;
  onTogglePriceList: () => void;
  onClosePriceList: () => void;
  onToggleStock: () => void;
  onCloseStock: () => void;
}

export const appContext = createContext({} as AppContext);
