/* eslint-disable prettier/prettier */
/* eslint-disable react/no-children-prop */
import { useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { FieldArray, useFormik, FormikProvider, useFormikContext } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useEffect, useState } from 'react';
import { CgArrowsExchangeAlt } from 'react-icons/cg';
import { BsPlusCircle } from 'react-icons/bs';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Select as ReactSelect } from 'chakra-react-select';
import { Heading } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { ErrorMessage, Loading } from '../common';
import { useCreateCashMovement, useGetOtherTributes, useGetPaymentMethods } from '../../hooks';
import { formatCurrency } from '../../utils';
import { useGetInvoceTypes } from '../../hooks/';
import { InvoceType } from '../../interfaces/interfaces';

import { schema } from '.';
import { usePosContext } from '.';

interface Payment {
  amount: string;
  paymentMethodId: string;
}

interface OtherTribute {
  amount: string;
  otherTributeId: string;
}

interface Values {
  discount: number | null;
  recharge: number | null;
  info: string;
  payments: Payment[];
  otherTributes?: OtherTribute[];
  invoceType?: {
    id: number;
    description: string;
    code: string;
  };
}

interface Sale {
  clientId: number;
  warehouseId: number;
  discount?: number;
  recharge?: number;
  invoceTypeId: number;
  cart: {
    productId: number;
    quantity: number;
    price: number;
    allow: boolean;
  }[];
  payments: {
    amount: number;
    paymentMethodId: number;
  }[];
  otherTributes: {
    amount: number;
    otherTributeId: number;
  }[];
  info: string;
}

export interface SelectedInvoceType extends InvoceType {
  value: number | undefined;
  label: string;
}

const AutoSubmit = () => {
  const { values, submitForm } = useFormikContext();

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return submitForm();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [values, submitForm]);

  return null;
};

export const FinishSale = () => {
  const [option, setOption] = useState('1');
  const [discount, setDiscount] = useState('0');
  const [recharge, setRecharge] = useState('0');
  const [percent, setPercent] = useState(true);

  const navigate = useNavigate();

  const {
    cart,
    client,
    emptyCart,
    goToPrevious,
    setActiveStep,
    setClient,
    setPriceList,
    setWarehouse,
    totalCart,
    totalCartItems,
    updateCartWithError,
    warehouse,
  } = usePosContext();

  const initialValues: Values = {
    discount: 0,
    recharge: 0,
    info: '',
    payments: [{ amount: totalCart.toString(), paymentMethodId: '1' }],
  };

  const queryClient = useQueryClient();

  const onSubmit = async (values: Values) => {
    const parsedValues = {
      discount: Number(values.discount),
      recharge: Number(values.recharge),
    };

    const sale: Sale = {
      clientId: Number(client?.id!),
      warehouseId: Number(warehouse?.id!),
      cart: cart.map((item) => ({
        productId: item.id!,
        quantity: Number(item.quantity),
        tax: Number(item.tax),
        price: item.price,
        allow: item.allownegativestock === 'ENABLED' ? true : false,
      })),
      invoceTypeId: values.invoceType?.id!,
      payments: values.payments.map((item) => ({
        amount: Number(item.amount),
        paymentMethodId: Number(item.paymentMethodId),
      })),
      otherTributes: values?.otherTributes?.filter(el => Number(el.amount) > 0).map((item) => ({
        amount: Number(item.amount),
        otherTributeId: Number(item.otherTributeId),
      })) || [],
      info: values.info,
    };

    if (option === '1') {
      sale.discount = 0;
      sale.recharge = 0;
    }

    if (option === '2') {
      if (percent) {
        sale.discount = Number((totalCart * parsedValues.discount) / 100);
        sale.recharge = 0;
      } else {
        sale.discount = Number(parsedValues.discount);
        sale.recharge = 0;
      }
    }

    if (option === '3') {
      if (percent) {
        sale.recharge = Number((totalCart * parsedValues.recharge) / 100);
        sale.discount = 0;
      } else {
        sale.recharge = Number(parsedValues.recharge);
        sale.discount = 0;
      }
    }

    if (totalCart !== sale.payments.reduce((acc, el) => acc + el.amount, 0)) {
      toast.error('El monto de la venta es distinto al de los pagos', {
        theme: 'colored',
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 5000,
        closeOnClick: true,
      });
    } else {
      mutateAsync(sale);
    }
  };

  const onSuccess = (res: any) => {
    toast.info(
      <Box>
        <Text>Venta Realizada</Text>
        <Button display='block' ml="auto" variant='solid' onClick={() => navigate(`/panel/caja/detalles/${3}`)}>Ver Factura</Button>
      </Box>,
      {
        theme: 'light',
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      }
    );
    emptyCart();
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setWarehouse(null);
    setClient(null);
    setPriceList(null);
    emptyCart();
    setActiveStep(1);
  };

  const onReset = () => {
    setWarehouse(null);
    setClient(null);
    setPriceList(null);
    emptyCart();
    setActiveStep(1);
  };

  const cb = (error: number[]) => {
    if (error.length > 0) {
      updateCartWithError(error);
      goToPrevious();
      toast.error('No hay suficiente stock en algunos productos', {
        theme: 'colored',
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 5000,
        closeOnClick: true,
      });
    }
  };

  const { mutateAsync, isLoading } = useCreateCashMovement(onSuccess, cb);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () => toFormikValidationSchema(schema),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  const { data: paymentMethods } = useGetPaymentMethods();
  const { data: invoceTypes } = useGetInvoceTypes();
  const { data: otherTributes } = useGetOtherTributes();

  const [mappedInvoceTypes, setMappedInvoceTypes] = useState<SelectedInvoceType[]>([]);

  useEffect(() => {
    if (!invoceTypes) return;

    const mappedInvoceTypes = invoceTypes.map((el) => ({
      ...el,
      value: el.id,
      label: `${el.code} - ${el.description}`,
    }));

    setMappedInvoceTypes(mappedInvoceTypes);
  }, [invoceTypes]);

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md">
      <ToastContainer />
      {
        !paymentMethods || !invoceTypes || !otherTributes ? <Loading /> : (
          <FormikProvider value={formik}>
            <form onSubmit={handleSubmit}>
              <Stack spacing="14px">
                <Button
                  colorScheme="brand"
                  leftIcon={<ArrowBackIcon />}
                  minW="150px"
                  mr="auto"
                  size="lg"
                  onClick={() => goToPrevious()}
                >
                  VOLVER
                </Button>

                <Flex gap="8" justifyContent="space-between">
                  <Stack w="64%">
                    <Stack border="1px solid whitesmoke" pb="4" px="4" rounded='md' w="full">
                      <Box position='relative' px="4" py='8'>
                        <Divider />
                        <AbsoluteCenter bg='white' px="2">
                          <FormLabel htmlFor="invoceTypeId">Tipo de Comprobante</FormLabel>
                        </AbsoluteCenter>
                      </Box>
                      <ReactSelect
                        autoFocus
                        isClearable
                        isSearchable
                        colorScheme="brand"
                        id="invoceTypeId"
                        name="invoceType"
                        options={mappedInvoceTypes}
                        placeholder="Seleccionar..."
                        selectedOptionColorScheme="brand"
                        value={
                          mappedInvoceTypes
                            ? mappedInvoceTypes.find((option) => option.id === values.invoceType?.id)
                            : ''
                        }
                        onChange={(selectedOption) => {
                          formik.setFieldValue('invoceType', selectedOption);
                        }}
                      />
                      {typeof errors.invoceType === 'string' && (
                        <ErrorMessage>{errors.invoceType}</ErrorMessage>
                      )}
                    </Stack>

                    <Stack border="1px solid whitesmoke" pb="4" px="4" rounded='md' w="full">
                      <Box position='relative' px="4" py='8'>
                        <Divider />
                        <AbsoluteCenter bg='white' px="2">
                          <FormLabel htmlFor="payments">Forma de Pago</FormLabel>
                        </AbsoluteCenter>
                      </Box>
                      <FieldArray
                        name="payments"
                        render={(arrayHelpers) => (
                          <Stack w="full">
                            {values.payments.map((_, index) => (
                              <Stack key={index} w="full">
                                <Stack alignItems="flex-end" direction="row" w="full">
                                  <Box w={'29%'}>
                                    <InputGroup>
                                      <InputLeftAddon children="$" />
                                      <Input
                                        defaultValue={
                                          values.payments.length === 1
                                            ? Math.round((totalCart + Number.EPSILON) * 100) / 100
                                            : Math.round(
                                              (Number(values.payments[index].amount) + Number.EPSILON) *
                                              100
                                            ) / 100
                                        }
                                        id={`payments[${index}].amount`}
                                        name={`payments[${index}].amount`}
                                        placeholder='importe'
                                        onChange={handleChange}
                                        onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                                      />
                                    </InputGroup>
                                    {typeof errors.payments === 'string' && (
                                      <ErrorMessage>{errors.payments}</ErrorMessage>
                                    )}
                                  </Box>

                                  <Box w={values.payments.length === index + 1 && index !== 0 ? '59%' : '70%'}>
                                    <Select
                                      id={`payments.${index}.paymentMethodId`}
                                      minW="224px"
                                      name={`payments.${index}.paymentMethodId`}
                                      onChange={handleChange}
                                    >
                                      {paymentMethods.map((method) => (
                                        <option key={method.code} value={method.id}>
                                          {method.code}
                                        </option>
                                      ))}
                                    </Select>
                                  </Box>
                                  {index >= 1 && index === values.payments.length - 1 && (
                                    <Button flex={1} onClick={() => arrayHelpers.remove(index)}>
                                      <Icon as={FaRegTrashAlt} color="brand" ml="0 auto" />
                                    </Button>
                                  )}
                                </Stack>
                                {typeof errors.payments === 'object' && (
                                  <ErrorMessage>El importe del pago debe ser mayor a 0</ErrorMessage>
                                )}
                              </Stack>

                            ))}

                            <Button
                              colorScheme="brand"
                              isDisabled={
                                totalCart ===
                                values.payments.reduce((acc, el) => acc + Number(el.amount), 0)
                              }
                              size="md"
                              variant="outline"
                              onClick={() => {
                                arrayHelpers.push({
                                  amount:
                                    totalCart -
                                    values.payments.reduce((acc, el) => acc + Number(el.amount), 0),
                                  paymentMethodId: '1',
                                });
                              }}
                            >
                              <Icon as={BsPlusCircle} color="brand" mr="2" />
                              Forma de Pago
                            </Button>
                          </Stack>
                        )}
                      />
                    </Stack>

                    <Stack border="1px solid whitesmoke" pb="4" px="4" rounded='md' w="full">
                      <Box position='relative' px="4" py='8'>
                        <Divider />
                        <AbsoluteCenter bg='white' px="2">
                          <FormLabel htmlFor="otherTributes">Otros Tributos</FormLabel>
                        </AbsoluteCenter>
                      </Box>
                      <FieldArray
                        name="otherTributes"
                        render={(arrayHelpers) => (
                          <Stack w="full">
                            {values?.otherTributes?.map((_, index) => (
                              <Stack key={index} w='full' >
                                <Stack alignItems="flex-end" direction="row" w="full">
                                  <Box w='29%'>
                                    <InputGroup>
                                      <InputLeftAddon children="$" />
                                      <Input
                                        defaultValue={0}
                                        id={`otherTributes[${index}].amount`}
                                        name={`otherTributes[${index}].amount`}
                                        onChange={handleChange}
                                        onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                                      />
                                    </InputGroup>
                                  </Box>

                                  <Box w='59%'>
                                    <Select
                                      id={`otherTributes.${index}.otherTributeId`}
                                      minW="224px"
                                      name={`otherTributes.${index}.otherTributeId`}
                                      onChange={handleChange}

                                    >
                                      {otherTributes.map((tribute) => (
                                        <option key={tribute.code} value={tribute.id}>
                                          {tribute.code} - {tribute.description}
                                        </option>
                                      ))}
                                    </Select>
                                  </Box>
                                  <Button flex={1} onClick={() => arrayHelpers.remove(index)}>
                                    <Icon as={FaRegTrashAlt} color="brand" m="0 auto" />
                                  </Button>
                                </Stack>
                                {Array.isArray(errors.otherTributes) && (
                                  <ErrorMessage>{errors.otherTributes[index]['amount']}</ErrorMessage>
                                )}
                              </Stack>

                            ))}

                            <Button
                              colorScheme="brand"
                              isDisabled={values.otherTributes?.some(el => Number(el.amount) <= 0)}
                              size="md"
                              variant="outline"
                              onClick={() => {
                                arrayHelpers.push({
                                  amount: 0,
                                  otherTributeId: '1',
                                });
                              }}
                            >
                              <Icon as={BsPlusCircle} color="brand" mr="2" />
                              Tributo
                            </Button>
                          </Stack>
                        )}
                      />
                    </Stack>

                    <Stack border="1px solid whitesmoke" pb="4" px="4" rounded='md' w="full">
                      <Box position='relative' px="4" py='8'>
                        <Divider />
                        <AbsoluteCenter bg='white' px="2">
                          <FormLabel htmlFor="option">Descuento/Recargo:</FormLabel>
                        </AbsoluteCenter>
                      </Box>
                      <Box>
                        <RadioGroup
                          defaultValue={option}
                          name="option"
                          py={2}
                          onChange={(e) => {
                            setOption(e);
                            setDiscount('0');
                            setRecharge('0');
                            formik.setFieldValue('discharge', '0');
                            formik.setFieldValue('recharge', '0');
                          }}
                        >
                          <Stack direction="row" gap="8">
                            <Radio value="1">No aplicar</Radio>
                            <Radio value="2">Aplicar Descuento</Radio>
                            <Radio value="3">Aplicar Recargo</Radio>
                          </Stack>
                        </RadioGroup>
                      </Box>

                      {
                        option !== "1" &&
                        <Flex gap="8" justifyContent="space-between" >
                          {option === '2' && (
                            <Box w="full">
                              <FormLabel htmlFor="discount">Descuento:</FormLabel>
                              <InputGroup>
                                {percent ? (
                                  <InputLeftAddon children="%" w="48px" />
                                ) : (
                                  <InputLeftAddon children="$" w="48px" />
                                )}
                                <Input
                                  id="discount"
                                  name="discount"
                                  value={discount}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setDiscount(e.target.value);
                                    setRecharge('0');
                                  }}
                                  onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                                />
                                <InputRightAddon
                                  children={
                                    <Tooltip label="Aternar entre porcentaje y valor">
                                      <Button
                                        onClick={() => {
                                          setPercent((current) => !current);
                                          setDiscount('0');
                                          setRecharge('0');
                                        }}
                                      >
                                        <Icon as={CgArrowsExchangeAlt} />
                                      </Button>
                                    </Tooltip>
                                  }
                                  p="0"
                                />
                              </InputGroup>
                              {errors.discount && touched.discount && (
                                <ErrorMessage>{errors.discount}</ErrorMessage>
                              )}
                            </Box>
                          )}
                          {option === '3' && (
                            <Box w="full">
                              <FormLabel htmlFor="recharge">Recargo:</FormLabel>
                              <InputGroup>
                                {percent ? (
                                  <InputLeftAddon children="%" w="48px" />
                                ) : (
                                  <InputLeftAddon children="$" w="48px" />
                                )}
                                <Input
                                  id="recharge"
                                  name="recharge"
                                  value={recharge}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setRecharge(e.target.value);
                                    setDiscount('0');
                                  }}
                                  onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                                />
                                <Tooltip label="Aternar entre porcentaje y valor">
                                  <InputRightAddon
                                    children={
                                      <Button
                                        onClick={() => {
                                          setPercent((current) => !current);
                                          setDiscount('0');
                                          setRecharge('0');
                                        }}
                                      >
                                        <Icon as={CgArrowsExchangeAlt} />
                                      </Button>
                                    }
                                    p="0"
                                  />
                                </Tooltip>
                              </InputGroup>
                              {errors.recharge && touched.recharge && (
                                <ErrorMessage>{errors.recharge}</ErrorMessage>
                              )}
                            </Box>
                          )}
                        </Flex>
                      }
                    </Stack>

                    <Stack border="1px solid whitesmoke" pb="4" px="4" rounded='md' w="full">
                      <Box position='relative' px="4" py='8'>
                        <Divider />
                        <AbsoluteCenter bg='white' px="2">
                          <FormLabel htmlFor="info">Información extra:</FormLabel>
                        </AbsoluteCenter>
                      </Box>
                      <Box>
                        <Textarea
                          defaultValue={initialValues.info}
                          id="info"
                          name="info"
                          placeholder="Info extra..."
                          onChange={handleChange}
                        />
                      </Box>
                    </Stack>

                    <Stack bg='gray.800' color='whitesmoke' pb="4" px="4" rounded='md' w="full">
                      <Text fontSize={24} textAlign="right">
                        {formatCurrency(totalCart)}
                      </Text>
                      {option === '2' && percent ? (
                        <Stack direction='row' justifyContent="flex-end" w="full">
                          <Text textAlign="right" w="80%" >
                            (Descuento)ss
                          </Text>
                          <Text fontSize={18} textAlign="right" w="20%">
                            {formatCurrency(((totalCart * Number(discount)) / 100) * -1 || 0)}
                          </Text>
                        </Stack>
                      ) : (
                        option === '2' && (
                          <Stack direction='row' justifyContent="flex-end" w="full">
                            <Text textAlign="right" w="80%" >
                              (Descuento)
                            </Text>
                            <Text fontSize={18} textAlign="right" w="20%">
                              {formatCurrency(Number(discount) * -1 || 0)}
                            </Text>
                          </Stack>
                        )
                      )}

                      {option === '3' && percent ? (
                        <Stack direction='row' justifyContent="flex-end" w="full">
                          <Text textAlign="right" w="80%" >
                            (Recargo)
                          </Text>
                          <Text fontSize={18} textAlign="right" w="20%">
                            {formatCurrency((totalCart * Number(recharge)) / 100 || 0)}
                          </Text>
                        </Stack>
                      ) : (
                        option === '3' && (
                          <Stack direction='row' justifyContent="flex-end" w="full">
                            <Text textAlign="right" w="80%" >
                              (Recargo)
                            </Text>
                            <Text fontSize={18} textAlign="right" w="20%">
                              {formatCurrency(Number(recharge) || 0)}
                            </Text>
                          </Stack>
                        )
                      )}
                      {
                        values.otherTributes?.filter(el => Number(el.amount) > 0).length && values.otherTributes?.filter(el => Number(el.amount) > 0).length > 0 && (
                          <Stack direction='row' justifyContent="flex-end" w="full">
                            <Text textAlign="right" w="80%" >
                              (Otros Impuestos)
                            </Text>
                            <Text fontSize={18} textAlign="right" w="20%">
                              {formatCurrency(values.otherTributes?.reduce((acc, el) => acc + Number(el.amount), 0))}
                            </Text>
                          </Stack>
                        )
                      }
                      <Divider ml="auto" w="50%" />
                      <Flex justifyContent="space-between" ml="auto" w="50%">
                        <Text fontSize={24}>TOTAL:</Text>
                        {percent && values.otherTributes?.length ? (
                          <Text fontSize={24} fontWeight="semibold" textAlign="right">
                            {!isNaN(totalCart + (totalCart * Number(recharge)) / 100 - (totalCart * Number(discount)) / 100) ? formatCurrency(
                              totalCart + (totalCart * Number(recharge)) / 100 - (totalCart * Number(discount)) / 100 + values.otherTributes.reduce((acc, el) => acc + Number(el.amount), 0)
                            ) : 'ERROR'}
                          </Text>
                        ) : (
                          <Text fontSize={24} fontWeight="semibold" textAlign="right">
                            {!isNaN(totalCart + Number(recharge) - Number(discount)) ? formatCurrency(totalCart + Number(recharge) - Number(discount) + (values?.otherTributes?.reduce((acc, el) => acc + Number(el.amount), 0) || 0)) : 'ERROR'}
                          </Text>
                        )}
                      </Flex>
                    </Stack>

                    <Stack direction="row" mt="4">
                      <Button mr={3} type="reset" variant="outline" w="full" onClick={onReset}>
                        CANCELAR
                      </Button>
                      <Button
                        colorScheme="brand"
                        isLoading={isLoading}
                        loadingText="CARGANDO VENTA"
                        type="submit"
                        w="full"
                      >
                        CARGAR VENTA
                      </Button>
                    </Stack>

                  </Stack>

                  <Stack w="35%">
                    <Stack border="1px solid whitesmoke" pb="4" px="4" rounded='md' w="full">
                      <Heading color="brand.500" fontSize="28" pt="2" textAlign="center">
                        Lista de Productos
                      </Heading>
                      <Stack maxH="818px" overflowY="auto">
                        {cart.map((item) => {
                          return (
                            <Stack key={nanoid()} fontFamily="mono" fontSize={14} position="relative" py="1">
                              <Box px="2">
                                <Stack
                                  alignItems="center"
                                  bg={item.error ? 'red.500' : 'blackAlpha.700'}
                                  direction="row"
                                  justifyContent="space-between"
                                  px="2"
                                  rounded="md"
                                >
                                  <Text color={item.error ? 'white' : 'whitesmoke'} fontWeight="bold">
                                    {item.name}
                                  </Text>
                                </Stack>
                                <Text px="2">
                                  cantidad: {item.quantity} {item.unit?.code}
                                </Text>
                                <Text px="2">precio: {formatCurrency(item.price)}</Text>
                                <Text px="2">
                                  iva: {formatCurrency(item.price * item.quantity * item.tax)} ({item.tax * 100}%)
                                </Text>
                                <Text px="2" textDecoration="underline">
                                  subtotal: {formatCurrency(item.price * item.quantity * (1 + item.tax))}
                                </Text>
                              </Box>
                            </Stack>
                          );
                        })}
                      </Stack>
                      <Divider />
                      <Text fontFamily="mono" fontSize="xl" fontWeight="bold" px="2" textAlign="right">
                        {formatCurrency(totalCart)}
                      </Text>
                      <Text fontFamily="mono" fontSize="xl" fontWeight="normal" px="2" textAlign="right">
                        productos: ({totalCartItems})
                      </Text>
                    </Stack>
                  </Stack>
                </Flex>
              </Stack>


              <AutoSubmit />
            </form>
          </FormikProvider >
        )
      }
    </Stack >
  );
};
