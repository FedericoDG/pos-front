import { Dispatch, MutableRefObject, createContext } from 'react';

import { User } from '../interfaces';

interface AppContext {
  top: MutableRefObject<null>;
  bottom: MutableRefObject<null>;
  tableInput: MutableRefObject<any>;
  handleScroll: (ref: MutableRefObject<HTMLElement | null>) => void;
  dispatch: Dispatch<any>;
  user: User;
  isOpenPriceList: boolean;
  isOpenStock: boolean;
  onTogglePriceList: () => void;
  onToggleStock: () => void;
}

export const appContext = createContext({} as AppContext);
