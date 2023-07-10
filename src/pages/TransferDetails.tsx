import { useParams } from 'react-router-dom';
import {
  Button,
  Flex,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
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
import { useGetTransfer } from '../hooks';
import { formatDate } from '../utils';

export const TransferDetails = () => {
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const { data: transfer, isFetching: isFetchingTransfer } = useGetTransfer(Number(id));

  const isIndeterminate = isFetchingTransfer;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalle de Transferencias entre Depósitos">
      {!transfer ? (
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
            <Stack pb="4">
              <TableContainer pb="4" w="full">
                <Table size="sm">
                  <Text as={'caption'} textAlign="left">
                    Transferencia entre Depósitos
                  </Text>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Fecha
                      </Th>
                      <Th bg="gray.700" color="white">
                        Depósito de Origen
                      </Th>
                      <Th bg="gray.700" color="white">
                        Depósito de Destino
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{formatDate(transfer.createdAt)}</Td>
                      <Td>{transfer.warehouseOrigin.code}</Td>
                      <Td>{transfer.warehouseDestination.code}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer w="full">
                <Table size="sm">
                  <Text as={'caption'} textAlign="left">
                    Detalles de la transferencia
                  </Text>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Cantidad
                      </Th>
                      <Th bg="gray.700" color="white">
                        Producto
                      </Th>
                      <Th bg="gray.700" color="white">
                        Código de Barra
                      </Th>
                      <Th bg="gray.700" color="white">
                        Categoría
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {transfer.transferDetails?.map((item) => (
                      <Tr key={nanoid()}>
                        <Td>
                          {item.quantity} {item.products?.unit?.code}
                        </Td>
                        <Td>{item.products?.name}</Td>
                        <Td>{item.products?.barcode}</Td>
                        <Td>{item.products?.category?.name}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>

            <Stack pb="4">
              <Stack direction="row">
                <TableContainer w="full">
                  <Table size="sm">
                    <Text as={'caption'} textAlign="left">
                      Depósito de Origen
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
                        <Td>{transfer.warehouseOrigin?.code}</Td>
                        <Td>{transfer.warehouseOrigin?.description}</Td>
                        <Td>{transfer.warehouseOrigin?.address}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer w="full">
                  <Table size="sm">
                    <Text as={'caption'} textAlign="left">
                      Depósito de Destino
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
                        <Td>{transfer.warehouseDestination?.code}</Td>
                        <Td>{transfer.warehouseDestination?.description}</Td>
                        <Td>{transfer.warehouseDestination?.address}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
            <Stack>
              <Stack direction="row" w="50%">
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
                        <Td>{transfer.user?.lastname}</Td>
                        <Td>{transfer.user?.name}</Td>
                        {transfer.user?.role?.name === 'USER' && <Td>USUARIO</Td>}
                        {transfer.user?.role?.name === 'SELLER' && <Td>VENDEDOR</Td>}
                        {transfer.user?.role?.name === 'ADMIN' && <Td>ADMINISTRADOR</Td>}
                        {transfer.user?.role?.name === 'SUPERADMIN' && <Td>SUPER</Td>}
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
