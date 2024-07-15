/* eslint-disable prettier/prettier */
import { useParams } from 'react-router-dom';
import {
  Button,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { nanoid } from 'nanoid';

import { useGetCurrentAccount, useGetPaymentMethods2 } from '../hooks';
import { DashBoard, Loading } from '../componets/common';
import { Modal } from '../componets/current_account';
import { formatCurrency, formatDate } from '../utils';

export const ClientDetails = () => {
  const { id } = useParams();


  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isFetching } = useGetCurrentAccount(Number(id));
  const { data: paymentMethods, isFetching: isFetching2 } = useGetPaymentMethods2();

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <DashBoard isIndeterminate={false} title="Cuenta Corriente">
      <Stack direction="row" justifyContent="flex-end" w="full">
        <Button
          alignSelf={'flex-end'}
          colorScheme="linkedin"
          leftIcon={<ImPrinter />}
          size="sm"
          onClick={handlePrint}
        >
          IMPRIMIR
        </Button>
      </Stack>
      <Stack ref={printRef} py="8" w="1024px">
        {
          !data || !paymentMethods || isFetching || isFetching2 ? <Loading /> :
            <Stack>
              <TableContainer w="full">
                <Table size="sm">
                  <caption>Cliente</caption>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Razón Social
                      </Th>
                      <Th bg="gray.700" color="white">
                        CUIT
                      </Th>
                      <Th bg="gray.700" color="white">
                        Teléfono
                      </Th>
                      <Th bg="gray.700" color="white">
                        Celular
                      </Th>
                      <Th bg="gray.700" color="white">
                        Email
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{data?.currentAccount.client.name}</Td>
                      <Td>{data?.currentAccount.client.document}</Td>
                      <Td>{data?.currentAccount.client.phone}</Td>
                      <Td>{data?.currentAccount.client.mobile}</Td>
                      <Td>{data?.currentAccount.client.email}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>

              <HStack alignItems={'center'} justify={'space-between'}>
                <TableContainer marginTop={4} w="50%">
                  <Table size="md">
                    <caption>Balance Cuenta Corriente</caption>
                    <Thead>
                      <Tr>
                        <Th isNumeric bg="gray.700" color="white">
                          CARGOS
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          PAGOS
                        </Th>
                        <Th isNumeric bg="gray.700" color="white">
                          TOTAL
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td isNumeric>{formatCurrency(data?.charges)}</Td>
                        <Td isNumeric>{formatCurrency(data?.payments)}</Td>
                        <Td isNumeric>{formatCurrency(data?.total)}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <Button className="no-print" colorScheme="brand" size={'lg'} variant={'solid'} onClick={onOpen}>
                  CARGAR UN PAGO
                </Button>
              </HStack>

              <TableContainer w="full">
                <Table size="sm">
                  <caption>Movimientos</caption>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Fecha
                      </Th>
                      <Th isNumeric bg="gray.700" color="white">
                        MONTO
                      </Th>
                      <Th bg="gray.700" color="white">
                        TIPO
                      </Th>
                      <Th bg="gray.700" color="white">
                        MÉTODO DE PAGO
                      </Th>
                      <Th bg="gray.700" color="white">
                        DETALLES
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.currentAccountDetails.map((el) => (
                      <Tr key={nanoid()}>
                        <Td>{formatDate(el.createdAt)}</Td>
                        <Td isNumeric color={el.type === 'PAYMENT' ? 'green.500' : 'red.500'}>
                          {`${el.type === 'PAYMENT'
                            ? formatCurrency(el.amount)
                            : formatCurrency(el.amount * -1)
                            }`}
                        </Td>
                        <Td>{`${el.type === 'PAYMENT' ? 'Pago' : 'Cargo'}`}</Td>
                        <Td>{el.type === 'PAYMENT' ? el.paymentMethod?.code : ''}</Td>
                        <Td>{el.details}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Modal currentAccountId={data.currentAccount.id!} handleClose={handleClose} isOpen={isOpen} max={data.total * -1} paymentMetods={paymentMethods} />
            </Stack>
        }
      </Stack>
    </DashBoard>
  );
};
