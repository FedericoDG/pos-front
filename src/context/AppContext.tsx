import { Dispatch, MutableRefObject, createContext } from 'react';

import { User } from '../interfaces';

interface AppContext {
  top: MutableRefObject<null>;
  bottom: MutableRefObject<null>;
  handleScroll: (ref: MutableRefObject<HTMLElement | null>) => void;
  dispatch: Dispatch<any>;
  user: User;
  isOpen: boolean;
  onToggle: () => void;
}

export const appContext = createContext({} as AppContext);
