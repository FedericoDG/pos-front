import {
  Box,
  HStack,
  Stack,
  Card,
  CardHeader,
  Heading,
  Badge,
  CardBody,
  StackDivider,
  TableContainer,
  Table,
  Text,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import Barcode from 'react-barcode';
import { useRef } from 'react';

import { formatDate, formatCurrency } from '../../utils';
import { Product } from '../../interfaces';
import { useMyContext } from '../../context';
import { roles } from '../../interfaces/roles';

interface Props {
  product: Product;
  onOpen: () => void;
  onOpen2: () => void;
  onOpen3: () => void;
}

export const General = ({ product, onOpen, onOpen2, onOpen3 }: Props) => {
  const {
    user: { role },
  } = useMyContext();

  const barcodeRef = useRef<any | null>(null);

  const getBgColor = ({
    totalStock,
    alertNeg,
    alertStock,
  }: {
    totalStock: number;
    alertNeg: string;
    alertStock: number;
  }): string => {
    if (totalStock <= 0) return 'red.400';
    if (alertNeg === 'ENABLED' && totalStock <= alertStock) return 'orange.300';

    return 'whatsapp.300';
  };

  return (
    <HStack alignItems="flex-start">
      <Stack w={{ base: 'full', xl: '50%' }}>
        <Card shadow="xs">
          <CardHeader>
            <Box alignItems="center" display="flex" justifyContent="space-between">
              <Stack>
                <Heading size="md">{product.name.toUpperCase()}</Heading>
                <Text fontSize="md">iva: {product.ivaCondition?.description!}</Text>
              </Stack>
              <Box h="92px" w="266px">
                {product.barcode && (
                  <Barcode ref={barcodeRef} height={50} value={product.barcode} width={2} />
                )}
              </Box>
            </Box>
            <Stack direction={{ base: 'column', md: 'row' }} justifyContent="flex-end" mt="2">
              <Badge colorScheme={product.status === 'ENABLED' ? 'green' : 'red'}>
                {product.status === 'ENABLED' ? 'habilitado' : 'deshabilitado'}
              </Badge>
              <Badge colorScheme={product.allownegativestock === 'ENABLED' ? 'red' : 'green'}>
                {product.allownegativestock === 'ENABLED'
                  ? 'permitir stock negativo'
                  : 'no permitir stock negativo'}
              </Badge>
              <Badge colorScheme={product.alertlowstock === 'ENABLED' ? 'green' : 'red'}>
                {product.alertlowstock === 'ENABLED'
                  ? 'alertar ante bajo stock'
                  : 'no alertar ante bajo stock'}
              </Badge>
            </Stack>
          </CardHeader>

          <CardBody pt="0">
            <Stack divider={<StackDivider />} spacing="4">
              <Box display="flex" justifyContent="space-between">
                <Stack>
                  <Text>Código Interno</Text>
                  <Text fontFamily="mono" fontSize="sm" pt="2">
                    {product.code}
                  </Text>
                </Stack>
                <Stack>
                  <Text textAlign="right">Descripción</Text>
                  <Text fontFamily="mono" fontSize="xs" pt="2">
                    {product.description}
                  </Text>
                </Stack>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Stack>
                  <Text>Unidad</Text>
                  <Text fontFamily="mono" fontSize="sm" pt="2">
                    {product.unit?.name}
                  </Text>
                </Stack>
                <Stack>
                  <Text textAlign="right">Abreviatura Unidad</Text>
                  <Text fontFamily="mono" fontSize="sm" pt="2" textAlign="right">
                    {product.unit?.code}
                  </Text>
                </Stack>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Stack>
                  <Text>Categoría</Text>
                  <Text fontFamily="mono" fontSize="sm" pt="2">
                    {product.category?.name}
                  </Text>
                </Stack>
                <Stack>
                  <Text textAlign="right">Desc. Categoría</Text>
                  <Text fontFamily="mono" fontSize="xs" pt="2" textAlign="right">
                    {product.category?.description}
                  </Text>
                </Stack>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Stack>

      <Stack bg="white" p="4" rounded="md" shadow="xs" w={{ base: 'full', xl: '50%' }}>
        {product.stocks && (
          <Stack>
            <Stack
              _dark={{ bg: 'gray.700', color: 'whitesmoke' }}
              direction="row"
              gap="5"
              mb="5"
              w="full"
            >
              <TableContainer w="full">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th isNumeric bg="gray.700" color="whitesmoke">
                        STOCK TOTAL
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td
                        isNumeric
                        bg={getBgColor({
                          totalStock: product.totalStock!,
                          alertNeg: product.alertlowstock,
                          alertStock: product.lowstock!,
                        })}
                      >
                        {product.totalStock} {product.unit?.code}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer w="full">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="whitesmoke">
                        DEPÓSITO
                      </Th>
                      <Th isNumeric bg="gray.700" color="whitesmoke">
                        STOCK
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {product.stocks.map((item) => (
                      <Tr key={nanoid()}>
                        <Td>{item.warehouse.code}</Td>
                        <Td isNumeric>
                          {item.stock} {product.unit?.code}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
            <Button
              colorScheme="brand"
              isDisabled={!!role?.id && role?.id >= roles.SELLER}
              mb="4"
              ml="auto"
              size="sm"
              w="210px"
              onClick={onOpen2}
            >
              CARGAR PERDIDA
            </Button>
          </Stack>
        )}

        <Stack>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th bg="gray.700" color="whitesmoke">
                    LISTA DE PRECIO
                  </Th>
                  <Th bg="gray.700" color="whitesmoke">
                    FECHA
                  </Th>
                  <Th isNumeric bg="gray.700" color="whitesmoke">
                    PRECIO
                  </Th>
                  <Th isNumeric bg="gray.700" color="whitesmoke">
                    PRECIO CON IVA
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {product.prices!.map((item) => (
                  <Tr key={nanoid()}>
                    <Td>{item?.pricelists?.code}</Td>
                    <Td w="180px">{formatDate(item?.createdAt)}</Td>
                    <Td isNumeric fontWeight="semibold">
                      {formatCurrency(item?.price! || 0)}
                    </Td>
                    <Td isNumeric fontWeight="semibold">
                      {formatCurrency(
                        item?.price! + item?.price! * product.ivaCondition?.tax! || 0
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Button
            colorScheme="brand"
            isDisabled={!!role?.id && role?.id >= roles.SELLER}
            mb="4"
            ml="auto"
            size="sm"
            w="210px"
            onClick={onOpen}
          >
            ACTUALIZAR PRECIOS
          </Button>

          {product.costs && (
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th bg="gray.700" color="whitesmoke">
                      FECHA
                    </Th>
                    <Th isNumeric bg="gray.700" color="whitesmoke">
                      COSTO
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr key={nanoid()}>
                    <Td w="180px">{formatDate(product.costs[0].createdAt)}</Td>
                    <Td isNumeric fontWeight="semibold">
                      {formatCurrency(product.costs[0].price)}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          )}
          <Button
            colorScheme="brand"
            isDisabled={!!role?.id && role?.id >= roles.SELLER}
            ml="auto"
            size="sm"
            w="210px"
            onClick={onOpen3}
          >
            ACTUALIZAR COSTO
          </Button>
        </Stack>
      </Stack>
    </HStack>
  );
};
