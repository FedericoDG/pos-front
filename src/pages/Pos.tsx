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
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useQueryClient } from 'react-query';

import { DashBoard, Loading } from '../componets/common';
import { PosProvider } from '../componets/pos/context';
import {
  Card,
  FinishSale,
  ProductsTable,
  StepperWrapper,
  Steps,
  SupplierAndWarehouse,
} from '../componets/pos';
import { useCashRegisterStatus, useOpenCashRegister } from '../hooks';

export const Pos = () => {
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
  };

  const { data: cashRegister, isFetching } = useCashRegisterStatus();
  const { mutate } = useOpenCashRegister(onSuccess);

  const openCashRegister = () => {
    mutate({ initialBalance, openingDate: new Date() });
  };

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent): void => {
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
    <PosProvider>
      <DashBoard isIndeterminate={isFetching} title="Punto de venta">
        {!cashRegister ? (
          <Loading />
        ) : cashRegister?.isOpen ? (
          <>
            <Steps />

            <Box w="full">
              <StepperWrapper step={1}>
                <SupplierAndWarehouse />
              </StepperWrapper>

              <StepperWrapper step={2}>
                <Stack>
                  <Card />
                  <ProductsTable />
                </Stack>
              </StepperWrapper>

              <StepperWrapper step={3}>
                <Stack>
                  <Card />
                  <FinishSale />
                </Stack>
              </StepperWrapper>
            </Box>
          </>
        ) : (
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
                          tabIndex={1}
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
                  <Button tabIndex={3} onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="brand"
                    isDisabled={!initialBalance}
                    ml={3}
                    tabIndex={2}
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
    </PosProvider>
  );
};
