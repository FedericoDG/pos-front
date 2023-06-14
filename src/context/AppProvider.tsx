import {
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { useDisclosure } from '@chakra-ui/react';

import { sessionStorage } from '../utils';
import { User } from '../interfaces';

import { authReducer } from './reducers';
import { loginAction } from './actions';
import { logoutAction } from './actions/auth';

import { appContext } from './';

const init = () => sessionStorage.read('user') || { logged: false };

interface Props {
  children: ReactNode;
}

export const AppProvider = ({ children }: Props) => {
  const { isOpen, onToggle } = useDisclosure();

  const [user, dispatch] = useReducer(authReducer, {}, init);

  const top = useRef(null);
  const bottom = useRef(null);

  useEffect(() => {
    if (!user) return;
    sessionStorage.write('user', user);
  }, [user]);

  const handleScroll = (ref: MutableRefObject<HTMLElement | null>) => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 250);
  };

  const values = useMemo(
    () => ({
      user,
      dispatch,
      top,
      bottom,
      handleScroll,
      isOpen,
      onToggle,
    }),
    [isOpen, onToggle, user]
  );

  return <appContext.Provider value={values}>{children}</appContext.Provider>;
};

export const useMyContext = () => {
  const { top, bottom, user, dispatch, handleScroll, isOpen, onToggle } = useContext(appContext);

  const dispatchLogin = (user: User) => dispatch(loginAction(user));

  const dispatchLogout = () => {
    dispatch(logoutAction());
    sessionStorage.remove('token');
  };

  return { top, bottom, user, dispatchLogin, dispatchLogout, handleScroll, isOpen, onToggle };
};
