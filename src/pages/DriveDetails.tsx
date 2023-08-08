import { useParams } from 'react-router-dom';
import {
  Button,
  Flex,
  Stack,
  Table,
  TableContainer,
  Text,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { nanoid } from 'nanoid';

import { DashBoard, Loading } from '../componets/common';
import { useGetWarehouse } from '../hooks';

export const DriverDetails = () => {
  const { id } = useParams();

  const printRef = useRef<any | null>(null);

  const { data: driver, isFetching: isFetchingDriver } = useGetWarehouse(Number(id));

  const isIndeterminate = isFetchingDriver;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalle de Chofer">
      {!driver ? (
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
                      <Td>{driver.user?.lastname}</Td>
                      <Td>{driver.user?.name}</Td>
                      {driver.user?.role?.name! === 'USER' && <Td>USUARIO</Td>}
                      {driver.user?.role?.name! === 'DRIVER' && <Td>CHOFER</Td>}
                      {driver.user?.role?.name! === 'SELLER' && <Td>VENDEDOR</Td>}
                      {driver.user?.role?.name! === 'ADMIN' && <Td>ADMINISTRADOR</Td>}
                      {driver.user?.role?.name! === 'SUPERADMIN' && <Td>SUPER</Td>}
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>

            <Stack direction="row">
              <TableContainer w="50%">
                <Table size="sm">
                  <Text as={'caption'} textAlign="left">
                    Stock
                  </Text>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Cantidad
                      </Th>
                      <Th bg="gray.700" color="white">
                        Producto
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {driver.stocks
                      ?.filter((el) => el.stock > 0)
                      .map((el, index) => {
                        if (index % 2 === 0) {
                          return (
                            <Tr key={nanoid()}>
                              <Td>
                                {el.stock} {el.products.unit?.code}
                              </Td>
                              <Td>{el.products.name}</Td>
                            </Tr>
                          );
                        }
                      })}
                  </Tbody>
                </Table>
              </TableContainer>

              <TableContainer w="50%">
                <Table size="sm">
                  <Text as={'caption'} color="transparent" textAlign="left">
                    {'.'}
                  </Text>
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="white">
                        Cantidad
                      </Th>
                      <Th bg="gray.700" color="white">
                        Producto
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {driver.stocks
                      ?.filter((el) => el.stock > 0)
                      .map((el, index) => {
                        if (index % 2 !== 0) {
                          return (
                            <Tr key={nanoid()}>
                              <Td>
                                {el.stock} {el.products.unit?.code}
                              </Td>
                              <Td>{el.products.name}</Td>
                            </Tr>
                          );
                        }
                      })}
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
