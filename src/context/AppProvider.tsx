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
  const {
    isOpen: isOpenCashRegister,
    onToggle: onToggleCashRegister,
    onClose: onCloseCashRegister,
  } = useDisclosure();
  const {
    isOpen: isOpenProducts,
    onToggle: onToggleProducts,
    onClose: onCloseProducts,
  } = useDisclosure();
  const {
    isOpen: isOpenPriceList,
    onToggle: onTogglePriceList,
    onClose: onClosePriceList,
  } = useDisclosure();
  const { isOpen: isOpenStock, onToggle: onToggleStock, onClose: onCloseStock } = useDisclosure();

  const [user, dispatch] = useReducer(authReducer, {}, init);

  const top = useRef(null);
  const bottom = useRef(null);
  const tableInput = useRef();

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
      bottom,
      dispatch,
      handleScroll,
      isOpenCashRegister,
      isOpenPriceList,
      isOpenProducts,
      isOpenStock,
      onCloseCashRegister,
      onClosePriceList,
      onCloseProducts,
      onCloseStock,
      onToggleCashRegister,
      onTogglePriceList,
      onToggleProducts,
      onToggleStock,
      tableInput,
      top,
      user,
    }),
    [
      isOpenPriceList,
      isOpenProducts,
      isOpenStock,
      isOpenCashRegister,
      onCloseCashRegister,
      onClosePriceList,
      onCloseProducts,
      onCloseStock,
      onToggleCashRegister,
      onTogglePriceList,
      onToggleProducts,
      onToggleStock,
      user,
    ]
  );

  return <appContext.Provider value={values}>{children}</appContext.Provider>;
};

export const useMyContext = () => {
  const {
    bottom,
    dispatch,
    handleScroll,
    isOpenCashRegister,
    isOpenPriceList,
    isOpenProducts,
    isOpenStock,
    onCloseCashRegister,
    onClosePriceList,
    onCloseProducts,
    onCloseStock,
    onToggleCashRegister,
    onTogglePriceList,
    onToggleProducts,
    onToggleStock,
    tableInput,
    top,
    user,
  } = useContext(appContext);

  const dispatchLogin = (user: User) => dispatch(loginAction(user));

  const dispatchLogout = () => {
    dispatch(logoutAction());
    sessionStorage.remove('token');
  };

  return {
    bottom,
    dispatchLogin,
    dispatchLogout,
    handleScroll,
    isOpenCashRegister,
    isOpenPriceList,
    isOpenProducts,
    isOpenStock,
    onCloseCashRegister,
    onClosePriceList,
    onCloseProducts,
    onCloseStock,
    onToggleCashRegister,
    onTogglePriceList,
    onToggleProducts,
    onToggleStock,
    tableInput,
    top,
    user,
  };
};
