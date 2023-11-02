import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useReactToPrint } from 'react-to-print';
import { ImPrinter } from 'react-icons/im';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

import { useGetStockMovements, useGetWarehousesWOStock } from '../../hooks';
import { Product, Warehouse } from '../../interfaces';
import { formatDate, getInvoiceLetter } from '../../utils';

import { EvoIcon, Graph } from '.';

export interface MappedWarehouse extends Warehouse {
  label: string;
  value: number | undefined;
}

interface Props {
  product: Product;
}

export const Stock = ({ product }: Props) => {
  const [from, setFrom] = useState<string>(new Date().toISOString().split('T')[0]);
  const [to, setTo] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mappedWarehouses, setMappedWarehouses] = useState<MappedWarehouse[]>([]);
  const [warehouse, setWarehouse] = useState<MappedWarehouse>();

  const onSuccess = () => {
    toast('Consulta sobre evolución de stock exitosa');
  };

  const { data: warehouses } = useGetWarehousesWOStock();
  const { mutate, data } = useGetStockMovements(onSuccess);

  const printRef = useRef<any | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    if (!warehouses) return;

    const mappedWarehouses = warehouses
      .map((el) => ({ ...el, value: el.id, label: el.code }))
      .filter((el) => el.driver !== 1);

    setMappedWarehouses(mappedWarehouses);
  }, [warehouses]);

  useEffect(() => {
    if (!warehouses || mappedWarehouses.length < 1) return;
    setWarehouse(mappedWarehouses[0]);
  }, [mappedWarehouses, warehouses]);

  return (
    <Stack bg="white" mx="auto" my={8} p="4" rounded="md" shadow="xs" w="210mm">
      <Box w="full">
        <Alert status="info">
          <AlertIcon />
          Seleccione las fechas y el depósito para obtener un informe.
        </Alert>
      </Box>
      <Stack direction="row">
        <Box w="50%">
          <FormLabel htmlFor="from">Inicio:</FormLabel>
          <Input
            autoFocus
            defaultValue={from}
            name="from"
            placeholder="Selecciona una fecha"
            size="md"
            tabIndex={1}
            type="date"
            onChange={(e) => setFrom(e.target.value)}
          />
        </Box>
        <Box w="50%">
          <FormLabel htmlFor="to">Final:</FormLabel>
          <Input
            defaultValue={to}
            name="to"
            placeholder="Selecciona una fecha"
            size="md"
            tabIndex={2}
            type="date"
            onChange={(e) => setTo(e.target.value)}
          />
        </Box>
      </Stack>
      <HStack alignItems="flex-end">
        <Box w="50%">
          <FormLabel htmlFor="warehouse">Depósito:</FormLabel>
          <Select
            autoFocus
            isClearable
            isSearchable
            colorScheme="brand"
            defaultValue={mappedWarehouses[0]}
            name="warehouse"
            options={mappedWarehouses}
            placeholder="Seleccionar Depósito"
            selectedOptionColorScheme="brand"
            tabIndex={2}
            value={warehouse}
            onChange={(e) => setWarehouse(e!)}
          />
        </Box>
        <Box w="50%">
          <Button
            colorScheme="brand"
            marginLeft="auto"
            size="md"
            tabIndex={6}
            w="full"
            onClick={() =>
              mutate({ productId: product.id!, warehouseId: warehouse?.id!, from, to })
            }
          >
            CONSULTAR
          </Button>
        </Box>
      </HStack>
      <Stack>
        {data ? (
          <Stack my={16}>
            <HStack justifyContent="flex-end">
              <Button
                colorScheme="linkedin"
                leftIcon={<ImPrinter />}
                size="sm"
                onClick={handlePrint}
              >
                Imprimir
              </Button>
            </HStack>
            <Stack ref={printRef}>
              <Stack alignItems="flex-start">
                <Heading fontWeight={500} size="md" textAlign="center" w="full">
                  INFORME DE EVOLUCIÓN DE STOCK
                </Heading>
                <HStack alignItems="flex-start" justifyContent="space-between" w="full">
                  <Stack>
                    <Text fontSize="lg">{`PRODUCTO: ${product?.name}`}</Text>
                    <Text fontSize="lg">{`DEPÓSITO: ${warehouse?.code}`}</Text>
                  </Stack>
                  <Text fontSize="lg">{`${formatDate(data.body.from)} AL ${formatDate(
                    data.body.to
                  )}`}</Text>
                </HStack>
                <Divider />
                {data.body.stock.length > 0 ? (
                  <Stack w="full">
                    <Graph />
                    <TableContainer my={2} w="full">
                      <Table size="sm">
                        <Thead>
                          <Tr>
                            <Th bg="gray.700" color="white">
                              FECHA
                            </Th>
                            <Th bg="gray.700" color="white">
                              COMPROBANTE
                            </Th>
                            <Th bg="gray.700" color="white">
                              CONCEPTO
                            </Th>
                            {/* <Th isNumeric bg="gray.700" color="white">
                            STOCK Anterior
                          </Th> */}
                            <Th isNumeric bg="gray.700" color="white">
                              STOCK ACTUAL
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {data.body.stock.map((el: any, idx: number) => (
                            <Tr key={nanoid()}>
                              <Td>{formatDate(el.createdAt)}</Td>

                              {/* CREACIÓN */}
                              {el.movement.concept === 'Creación' && <Td />}

                              {/* COMPRA */}
                              {el.movement.concept === 'Compra' && (
                                <Td>
                                  <Link
                                    color="black"
                                    fontSize={14}
                                    fontWeight={400}
                                    href={`/panel/stock/compras/detalles/${el.movement.purchase?.id}`}
                                    target="_blank"
                                    variant="link"
                                    w="full"
                                  >
                                    compra {el.movement.purchase?.id}
                                  </Link>
                                </Td>
                              )}

                              {/* VENTA - AFIP */}
                              {el.movement.concept === 'Venta' && el.movement.cashMovement.cae && (
                                <Td>
                                  <Link
                                    color="black"
                                    fontSize={14}
                                    fontWeight={400}
                                    href={`/panel/caja/detalles/venta/afip/${el.movement.cashMovement?.id}`}
                                    target="_blank"
                                    variant="link"
                                    w="full"
                                  >
                                    {getInvoiceLetter(el.movement.cashMovement?.cbteTipo!)}{' '}
                                    {el.movement.cashMovement?.posNumber
                                      ?.toString()
                                      .padStart(3, '0')}
                                    {'-'}
                                    {el.movement.cashMovement?.invoceNumberAfip
                                      ?.toString()
                                      .padStart(8, '0')}
                                  </Link>
                                </Td>
                              )}

                              {/* VENTA - NO AFIP */}
                              {el.movement.concept === 'Venta' && !el.movement.cashMovement.cae && (
                                <Td>
                                  <Link
                                    color="black"
                                    fontSize={14}
                                    fontWeight={400}
                                    href={`/panel/caja/detalles/venta/${el.movement.cashMovement?.id}`}
                                    target="_blank"
                                    variant="link"
                                    w="full"
                                  >
                                    {getInvoiceLetter(el.movement.cashMovement?.cbteTipo!)}{' '}
                                    {el.movement.cashMovement?.posNumber
                                      ?.toString()
                                      .padStart(3, '0')}
                                    {'-'}
                                    {el.movement.cashMovement?.id?.toString().padStart(8, '0')}
                                  </Link>
                                </Td>
                              )}

                              {/* NOTA DE CRÉDITO - AFIP */}
                              {el.movement.concept === 'N. de Crédito' &&
                                el.movement.cashMovement.cae && (
                                  <Td>
                                    <Link
                                      color="black"
                                      fontSize={14}
                                      fontWeight={400}
                                      href={`/panel/caja/detalles/venta/afip/${el.movement.cashMovement?.id}`}
                                      target="_blank"
                                      variant="link"
                                      w="full"
                                    >
                                      {getInvoiceLetter(el.movement.cashMovement?.cbteTipo!)}{' '}
                                      {el.movement.cashMovement?.posNumber
                                        ?.toString()
                                        .padStart(3, '0')}
                                      {'-'}
                                      {el.movement.cashMovement?.invoceNumberAfip
                                        ?.toString()
                                        .padStart(8, '0')}
                                    </Link>
                                  </Td>
                                )}

                              {/* NOTA DE CRÉDITO - NO AFIP */}
                              {el.movement.concept === 'N. de Crédito' &&
                                !el.movement.cashMovement.cae && (
                                  <Td>
                                    <Link
                                      color="black"
                                      fontSize={14}
                                      fontWeight={400}
                                      href={`/panel/caja/detalles/venta/${el.movement.cashMovement?.id}`}
                                      target="_blank"
                                      variant="link"
                                      w="full"
                                    >
                                      {getInvoiceLetter(el.movement.cashMovement?.cbteTipo!)}{' '}
                                      {el.movement.cashMovement?.posNumber
                                        ?.toString()
                                        .padStart(3, '0')}
                                      {'-'}
                                      {el.movement.cashMovement?.id?.toString().padStart(8, '0')}
                                    </Link>
                                  </Td>
                                )}

                              {/* TRANSFERENCIA */}
                              {el.movement.concept === 'Transferencia' && (
                                <Td>
                                  <Link
                                    color="black"
                                    fontSize={14}
                                    fontWeight={400}
                                    href={`/panel/stock/transferencias/detalles/${el.movement.transfer?.id}`}
                                    target="_blank"
                                    variant="link"
                                    w="full"
                                  >
                                    transfer {el.movement.transfer?.id}
                                  </Link>
                                </Td>
                              )}

                              {/* BAJA/PÉRDIDA */}
                              {el.movement.concept === 'Baja/Pérdida' && (
                                <Td>
                                  <Link
                                    color="black"
                                    fontSize={14}
                                    fontWeight={400}
                                    href={`/panel/stock/bajas/detalles/${el.movement.discharge?.id}`}
                                    target="_blank"
                                    variant="link"
                                    w="full"
                                  >
                                    baja {el.movement.discharge?.id}
                                  </Link>
                                </Td>
                              )}

                              <Td>{el.movement.concept}</Td>

                              {/*  {idx === data.body.stock.length - 1 ? (
                              <Td isNumeric />
                            ) : (
                              <Td isNumeric>
                                {data.body.stock[`${idx + 1}`].stock} {product.unit?.code}
                              </Td>
                            )} */}

                              <Td isNumeric>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  {/* {Math.max(el.stock, 0)} {product.unit?.code} */}
                                  {el.stock} {product.unit?.code}
                                  <EvoIcon el={el} />
                                </div>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Stack>
                ) : (
                  <Text fontSize={'xl'} mt={8} textAlign={'center'} textColor={'gray.900'} w="full">
                    NO EXISTEN DATOS PARA LAS FECHAS Y DEPÓSITO SELECCIONADO
                  </Text>
                )}

                <pre>{JSON.stringify(data.body.stock, null, 2)}</pre>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Text fontSize={'xl'} mt={8} textAlign={'center'} textColor={'gray.500'}>
            REALICE UNA CONSULTA
          </Text>
        )}
      </Stack>
    </Stack>
  );
};
