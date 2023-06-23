import { useParams } from 'react-router-dom';
import {
  Button,
  Flex,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { nanoid } from 'nanoid';
import { Text } from '@chakra-ui/react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

import { DashBoard, Loading } from '../componets/common';
import { formatCurrency, formatDate } from '../utils';
import { useGetDischarge } from '../hooks';

export const DischargeDetails = () => {
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const { data: discharge, isFetching: isFetchingDischarge } = useGetDischarge(Number(id));

  const isIndeterminate = isFetchingDischarge;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalles de Baja de Productos">
      {!discharge ? (
        <Loading />
      ) : (
        <Flex
          alignItems="center"
          bg="white"
          flexDir={{ base: 'column' }}
          justifyContent="space-between"
          p="4"
          rounded="md"
          shadow="md"
          w="full"
        >
          <Button
            alignSelf={'flex-end'}
            colorScheme="linkedin"
            leftIcon={<ImPrinter />}
            size="sm"
            onClick={handlePrint}
          >
            Imprimir
          </Button>
          <Stack ref={printRef} minW="1024px" py="8">
            <Stack>
              <TableContainer w="full">
                <Table size="sm">
                  <Text as={'caption'} textAlign="left">
                    Baja de Produtos
                  </Text>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Fecha
                      </Th>
                      <Th isNumeric bg="gray.700" color="white">
                        Pérdida Total
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{formatDate(discharge.createdAt)}</Td>
                      <Td isNumeric color="#4a5568" fontSize={16} fontWeight="bold">
                        {formatCurrency(Number(discharge.cost))}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer w="full">
                <Table size="sm">
                  <Text as={'caption'} textAlign="left">
                    Detalles de la baja
                  </Text>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Cantidad
                      </Th>
                      <Th bg="gray.700" color="white">
                        Costo Unitario
                      </Th>
                      <Th bg="gray.700" color="white">
                        Producto
                      </Th>
                      <Th bg="gray.700" color="white">
                        Código de Barra
                      </Th>
                      <Th bg="gray.700" color="white">
                        Razón
                      </Th>
                      <Th isNumeric bg="gray.700" color="white">
                        Subtotal
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {discharge.dischargeDetails?.map((item, idx) => (
                      <Tr key={nanoid()}>
                        <Td>
                          {item.quantity} {item.products?.unit?.code}
                        </Td>
                        <Td>{formatCurrency(item.cost)}</Td>
                        <Td>{item.products?.name}</Td>
                        <Td>{item.products?.barcode}</Td>
                        <Td>{item.reason.reason}</Td>
                        <Td isNumeric>{formatCurrency(item.quantity * item.cost)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th isNumeric colSpan={6} fontSize={16} p="2">
                        {formatCurrency(Number(discharge.cost))}
                      </Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </Stack>

            <Stack>
              <Stack direction="row">
                <TableContainer w="full">
                  <Table size="sm">
                    <Text as={'caption'} textAlign="left">
                      Depósito
                    </Text>
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Código
                        </Th>
                        <Th bg="gray.700" color="white">
                          Descripción
                        </Th>
                        <Th bg="gray.700" color="white">
                          Dirección
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{discharge.warehouses?.code}</Td>
                        <Td>{discharge.warehouses?.description}</Td>
                        <Td>{discharge.warehouses?.address}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer w="full">
                  <Table size="sm">
                    <Text as={'caption'} textAlign="left">
                      Usuario
                    </Text>
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="white">
                          Apellido
                        </Th>
                        <Th bg="gray.700" color="white">
                          Nombre
                        </Th>
                        <Th bg="gray.700" color="white">
                          Rol
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{discharge.user?.lastname}</Td>
                        <Td>{discharge.user?.name}</Td>
                        {discharge.user?.role.name === 'USER' && <Td>USUARIO</Td>}
                        {discharge.user?.role.name === 'SELLER' && <Td>VENDEDOR</Td>}
                        {discharge.user?.role.name === 'ADMIN' && <Td>ADMINISTRADOR</Td>}
                        {discharge.user?.role.name === 'SUPERADMIN' && <Td>SUPER</Td>}
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
          </Stack>
        </Flex>
      )}
    </DashBoard>
  );
};
