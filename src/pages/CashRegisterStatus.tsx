/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { HiPlus } from 'react-icons/Hi';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { CustomTable } from '../componets/table';
import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common';
import { useColumns } from '../componets/cash_register_status/hooks';
import { useCashRegisterStatus, useCloseCashRegister, useOpenCashRegister } from '../hooks';

export const CashRegisterStatus = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [initialBalance, setInitialBalance] = useState(0);

  const queryClient = useQueryClient();

  const onSuccess = () => {
    toast.info('Caja abierta', {
      theme: 'colored',
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 3000,
      closeOnClick: true,
    });

    queryClient.invalidateQueries({ queryKey: ['cashRegisters'] });

    setInitialBalance(0);
    onClose();
  };

  const onSuccessClose = () => {
    toast.info('Caja cerrada', {
      theme: 'colored',
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 3000,
      closeOnClick: true,
    });

    queryClient.invalidateQueries({ queryKey: ['cashRegisters'] });

    setInitialBalance(0);
  };

  const { data: cashRegister, isFetching: isFetchingCashRegister } = useCashRegisterStatus();

  const { mutate: openCR } = useOpenCashRegister(onSuccess);
  const { mutate: closeCR } = useCloseCashRegister(onSuccessClose);

  const openCashRegister = () => {
    openCR({ initialBalance, openingDate: new Date() });
  };

  const closeCashRegister = () => {
    closeCR({ closingDate: new Date() });
  };

  const isIndeterminate = isFetchingCashRegister;

  const { columns } = useColumns();

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return onOpen();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [onOpen]);

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Caja - Estado">
      {!cashRegister ? (
        <Loading />
      ) : (
        <>
          {!cashRegister.isOpen ? (
            <>
              <Button
                colorScheme="brand"
                leftIcon={<HiPlus />}
                mb={4}
                ml="auto"
                size="lg"
                onClick={onOpen}
              >
                ABRIR CAJA
              </Button>
            </>
          ) : (
            <>
              <Button
                colorScheme="brand"
                leftIcon={<AiOutlineClose />}
                mb={4}
                ml="auto"
                size="lg"
                onClick={closeCashRegister}
              >
                CERRAR CAJA
              </Button>
              <Box w="full">
                <CustomTable
                  showColumsSelector
                  showPrintOption
                  amount={[cashRegister].length}
                  columns={columns}
                  data={[cashRegister]}
                />
              </Box>
            </>
          )}

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter="blur(5px) hue-rotate(90deg)" bg="blackAlpha.300" />
            <ModalContent>
              <ModalHeader>Abrir Caja</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing="14px">
                  <Box>
                    <FormLabel htmlFor="initialBalance">Balance Inicial:</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="$" />
                      <Input
                        autoFocus
                        id="initialBalance"
                        name="initialBalance"
                        type="number"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(Number(e.target.value))}
                        onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                      />
                    </InputGroup>
                  </Box>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                  colorScheme="brand"
                  isDisabled={!initialBalance}
                  ml={3}
                  onClick={openCashRegister}
                >
                  Agregar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </DashBoard>
  );
};
