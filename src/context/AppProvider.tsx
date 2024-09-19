import {
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
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
  const {
    isOpen: isOpenCurrentAccount,
    onToggle: onToggleCurrentAccount,
    onClose: onCloseCurrentAccount,
  } = useDisclosure();
  const { isOpen: isOpenStock, onToggle: onToggleStock, onClose: onCloseStock } = useDisclosure();

  const [user, dispatch] = useReducer(authReducer, {}, init);
  const initResponsableInscripto = () => {
    const res = sessionStorage.read('responsableInscripto');

    if (res) return Number(res);

    return null;
  };

  const [responsableInscripto, setResponsableInscripto] = useState<number | null>(() =>
    initResponsableInscripto()
  );

  const top = useRef(null);
  const bottom = useRef(null);
  const tableInput = useRef();

  useEffect(() => {
    if (!user) return;
    sessionStorage.write('user', user);
  }, [user]);

  useEffect(() => {
    if (!responsableInscripto) return;
    sessionStorage.write2('responsableInscripto', responsableInscripto.toString());
  }, [responsableInscripto]);

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
      responsableInscripto,
      setResponsableInscripto,
      isOpenCurrentAccount,
      onToggleCurrentAccount,
      onCloseCurrentAccount,
    }),
    [
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
      user,
      responsableInscripto,
      isOpenCurrentAccount,
      onToggleCurrentAccount,
      onCloseCurrentAccount,
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
    responsableInscripto,
    setResponsableInscripto,
    isOpenCurrentAccount,
    onToggleCurrentAccount,
    onCloseCurrentAccount,
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
    responsableInscripto,
    setResponsableInscripto,
    isOpenCurrentAccount,
    onToggleCurrentAccount,
    onCloseCurrentAccount,
  };
};
