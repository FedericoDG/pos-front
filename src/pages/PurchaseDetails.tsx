import { useParams } from 'react-router-dom';
import {
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
import { Text, Button } from '@chakra-ui/react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

import { DashBoard, Loading } from '../componets/common';
import { formatCurrency, formatDate } from '../utils';
import { useGetPurchase } from '../hooks';

export const PurchaseDetails = () => {
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const { data: purchase, isFetching: isFetchingPurchase } = useGetPurchase(Number(id));

  const isIndeterminate = isFetchingPurchase;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalles de la Compra">
      {!purchase ? (
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
                    Compra
                  </Text>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Fecha
                      </Th>
                      <Th bg="gray.700" color="white">
                        Transporte
                      </Th>
                      <Th bg="gray.700" color="white">
                        Chofer
                      </Th>
                      <Th isNumeric bg="gray.700" color="white">
                        Total de la Compra
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{formatDate(purchase.date)}</Td>
                      <Td>{purchase.transport}</Td>
                      <Td>{purchase.driver}</Td>
                      <Td isNumeric color="#4a5568" fontSize={16} fontWeight="bold">
                        {formatCurrency(purchase.total)}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer w="full">
                <Table size="sm">
                  <Text as={'caption'} textAlign="left">
                    Detalles de la compra
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
                        Categoría
                      </Th>
                      <Th isNumeric bg="gray.700" color="white">
                        Subtotal
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {purchase.purchaseDetails?.map((item) => (
                      <Tr key={nanoid()}>
                        <Td>
                          {item.quantity} {item.product.unit?.code}
                        </Td>
                        <Td>{formatCurrency(item.price)}</Td>
                        <Td>{item.product.name}</Td>
                        <Td>{item.product.barcode}</Td>
                        <Td>{item.product.category?.name}</Td>
                        <Td isNumeric>{formatCurrency(item.quantity * item.price)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th isNumeric colSpan={6} fontSize={16} p="2">
                        {formatCurrency(purchase.total)}
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
                        <Td>{purchase.warehouse?.code}</Td>
                        <Td>{purchase.warehouse?.description}</Td>
                        <Td>{purchase.warehouse?.address}</Td>
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
                        <Td>{purchase.user?.lastname}</Td>
                        <Td>{purchase.user?.name}</Td>
                        {purchase.user?.role.name === 'USER' && <Td>USUARIO</Td>}
                        {purchase.user?.role.name === 'SELLER' && <Td>VENDEDOR</Td>}
                        {purchase.user?.role.name === 'ADMIN' && <Td>ADMINISTRADOR</Td>}
                        {purchase.user?.role.name === 'SUPERADMIN' && <Td>SUPER</Td>}
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>

              <TableContainer>
                <Table size="sm">
                  <Text as={'caption'} textAlign="left">
                    Proveedor
                  </Text>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        CUIT
                      </Th>
                      <Th bg="gray.700" color="white">
                        Nombre
                      </Th>
                      <Th bg="gray.700" color="white">
                        Email
                      </Th>
                      <Th bg="gray.700" color="white">
                        Teléfono
                      </Th>
                      <Th bg="gray.700" color="white">
                        Celular
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{purchase.supplier?.cuit}</Td>
                      <Td>{purchase.supplier?.name}</Td>
                      <Td>{purchase.supplier?.email}</Td>
                      <Td>{purchase.supplier?.phone}</Td>
                      <Td>{purchase.supplier?.mobile}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </Stack>
        </Flex>
      )}
    </DashBoard>
  );
};
