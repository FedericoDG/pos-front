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
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

import { DashBoard, Loading } from '../componets/common';
import { PosProvider } from '../componets/pos2/context';
import {
  Card,
  FinishSale,
  ProductsTable,
  StepperWrapper,
  Steps,
  SupplierAndWarehouse,
} from '../componets/pos2';
import { useCashRegisterStatus, useOpenCashRegister } from '../hooks';

export const Pos2 = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const queryClient = useQueryClient();

  const onSuccess = () => {
    toast.success('Caja abierta');

    queryClient.invalidateQueries({ queryKey: ['cashRegisters'] });
  };

  const { data: cashRegister, isFetching } = useCashRegisterStatus();
  const { mutate } = useOpenCashRegister(onSuccess);

  const openCashRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const initialBalance = Number(e.currentTarget.initialBalance.value);

    if (initialBalance > 0) {
      mutate({ initialBalance, openingDate: new Date() });
    }
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
      <DashBoard isIndeterminate={isFetching} title="Remito Valorizado">
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
                  <Card disableBtn={false} />
                  <ProductsTable />
                </Stack>
              </StepperWrapper>

              <StepperWrapper step={3}>
                <Stack>
                  <Card disableBtn={true} />
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
                <form onSubmit={openCashRegister}>
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
                            onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                          />
                        </InputGroup>
                      </Box>
                    </Stack>
                  </ModalBody>

                  <ModalFooter>
                    <Button tabIndex={3} type="reset" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button colorScheme="brand" ml={3} tabIndex={2} type="submit">
                      Agregar
                    </Button>
                  </ModalFooter>
                </form>
              </ModalContent>
            </Modal>
          </>
        )}
      </DashBoard>
    </PosProvider>
  );
};
