import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  ReactNode,
  MutableRefObject,
  useContext,
} from 'react';

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
    }),
    [user]
  );

  return <appContext.Provider value={values}>{children}</appContext.Provider>;
};

export const useMyContext = () => {
  const { top, bottom, user, dispatch, handleScroll } = useContext(appContext);

  const dispatchLogin = (user: User) => dispatch(loginAction(user));

  const dispatchLogout = () => {
    dispatch(logoutAction());
    sessionStorage.remove('token');
  };

  return { top, bottom, user, dispatchLogin, dispatchLogout, handleScroll };
};
