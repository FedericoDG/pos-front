/* eslint-disable prettier/prettier */
/* eslint-disable react/no-children-prop */
import { useQueryClient } from 'react-query';
import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Icon,
  Heading,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CgArrowsExchangeAlt } from 'react-icons/cg';
import { BsCheckCircle, BsPlusCircle } from 'react-icons/bs';
import { FaRegTrashAlt } from 'react-icons/fa';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FiAlertTriangle } from 'react-icons/fi';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { toast } from 'sonner';

import { ErrorMessage, Loading } from '../common';
import { useCreateAfipInvoce, useCreateCashMovement, useGetOtherTributes, useGetPaymentMethods, useGetSettings } from '../../hooks';
import { formatCurrency } from '../../utils';
import { useGetInvoceTypes } from '../../hooks/';
import { useMyContext } from '../../context';

import { CartItem, schema } from '.';
import { usePosContext } from '.';

interface Payment {
  amount: string;
  paymentMethodId: string;
}

interface OtherTribute {
  otherTributeId: string;
  code: string;
  amount: string;
  description: string;
}

interface Values {
  discount: number | null;
  recharge: number | null;
  info: string;
  payments?: Payment[];
  otherTributes?: OtherTribute[];
  invoceType?: {
    id: number;
    description: string;
    code: string;
  };
}

interface Sale {
  iva: boolean;
  clientId: number;
  warehouseId: number;
  discount?: number;
  discountPercent?: number;
  recharge?: number;
  rechargePercent?: number;
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
    otherTributeId: number;
    id: number;
    amount: number;
    description: string;
  }[];
  info: string;
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
  const {
    cart,
    client,
    emptyCart,
    goToPrevious,
    iva,
    setActiveStep,
    setClient,
    setPriceList,
    setWarehouse,
    totalCartItems,
    updateCartWithError,
    warehouse,
    invoceType,
    subTotalCart
  } = usePosContext();

  const [option, setOption] = useState('1');
  const [discount, setDiscount] = useState('0');
  const [recharge, setRecharge] = useState('0');
  const [percent, setPercent] = useState(true);
  const [lockDOrR, setLockDOrR] = useState(false);
  const [cartCopy, setCartCopy] = useState<CartItem[]>([]);

  const subTotalCartCopy = useMemo(
    () => cartCopy.reduce((acc, item) => acc + item.quantity * item.price, 0),
    [cartCopy]
  );

  const totalIvaCartCopy = useMemo(
    () => cartCopy.reduce((acc, item) => acc + item.quantity * item.price * item.tax, 0),
    [cartCopy]
  );

  const totalCartCopy = useMemo(
    () => cartCopy.reduce((acc, item) => acc + item.quantity * (item.price + item.price * item.tax), 0),
    [cartCopy]
  );

  const recalculateCart = useCallback(
    (num: number) => {
      const newCart: CartItem[] = [];

      console.log(subTotalCartCopy);

      for (let i = 0; i < cart.length; i++) {
        const percent = (cart[i].quantity * cart[i].price) / subTotalCartCopy;

        console.log('porcentaje: ', percent);

        const element = { ...cart[i], price: cart[i].price + percent * num / cart[i].quantity };

        newCart.push(element);
      }

      setCartCopy(newCart);
    },
    [cart, subTotalCartCopy]
  );


  const initialValues = {
    discount: 0,
    recharge: 0,
    info: '',
  };

  const navigate = useNavigate();

  const { data: settings } = useGetSettings(1);
  const { data: paymentMethods } = useGetPaymentMethods();
  const { data: invoceTypes } = useGetInvoceTypes();
  const { data: otherTributes } = useGetOtherTributes();

  const queryClient = useQueryClient();

  const { user } = useMyContext();

  const onSubmit = async (values: Values) => {
    const parsedValues = {
      discount: Number(values.discount),
      recharge: Number(values.recharge),
    };

    const sale: Sale = {
      iva: true,
      clientId: Number(client?.id!),
      warehouseId: Number(warehouse?.id!),
      cart: cartCopy.map((item) => ({
        productId: item.id!,
        quantity: Number(item.quantity),
        tax: Number(item.tax),
        price: item.price,
        allow: item.allownegativestock === 'ENABLED' ? true : false,
      })),
      invoceTypeId: invoceType?.id!,
      payments: values?.payments?.map((item) => ({
        amount: Number(item.amount),
        paymentMethodId: Number(item.paymentMethodId),
      })) || [],
      otherTributes: values?.otherTributes?.filter(el => Number(el.amount) > 0).map((item) => {
        const tribute = otherTributes?.find(el => el.id === Number(item.otherTributeId));

        return {
          amount: Number(item.amount),
          otherTributeId: Number(item.otherTributeId),
          id: Number(tribute?.code),
          description: tribute?.description!
        };
      }) || [],
      info: values.info,
    };

    if (!iva) {
      sale.iva = false;
    }

    if (option === '1') {
      sale.discount = 0;
      sale.discountPercent = 0;
      sale.recharge = 0;
      sale.rechargePercent = 0;
    }

    if (option === '2') {
      if (percent) {
        sale.discount = Number((subTotalCart * parsedValues.discount) / 100);
        sale.discountPercent = Number((parsedValues.discount));
        sale.recharge = 0;
        sale.rechargePercent = 0;
      } else {
        sale.discount = Number(parsedValues.discount);
        sale.discountPercent = Number((parsedValues.discount / subTotalCart) * 100);
        sale.recharge = 0;
        sale.rechargePercent = 0;
      }
    }

    if (option === '3') {
      if (percent) {
        sale.recharge = Number((subTotalCart * parsedValues.recharge) / 100);
        sale.rechargePercent = Number((parsedValues.recharge));
        sale.discount = 0;
        sale.discountPercent = 0;
      } else {
        sale.recharge = Number((parsedValues.recharge));
        sale.rechargePercent = Number((parsedValues.recharge / subTotalCart) * 100);
        sale.discount = 0;
        sale.discountPercent = 0;
      }
    }

    if (Math.round(totalCartCopy + sale.otherTributes.reduce((acc, el) => acc + el.amount, 0)) !== Math.round(sale.payments.reduce((acc, el) => acc + el.amount, 0))) {
      toast.error('El monto de la venta es distinto al de los pagos');
    } else {
      mutateAsync(sale).then((res: any) => {
        const { id } = res.body.cashMovement;

        if (invoceType?.code !== '555' && user.roleId !== 4) {
          createAfipInvoce({ ...sale, cashMovementId: id });
        }
      });
    }
  };

  const onSuccessAfip = (res: any) => {
    toast('Comprobante de AFIP Creado'/* , {
      action: {
        label: 'Ver',
        onClick: () => navigate(`/panel/caja/detalles/venta/afip/${res.body.cashMovement.id}`)
      },
    } */);
    navigate(`/panel/caja/detalles/venta/afip/${res.body.cashMovement.id}`);
  };

  const onSuccess = (res: any) => {
    toast.success('Venta Realizada', {
      action: {
        label: 'Ver',
        onClick: () => navigate(`/panel/caja/detalles/${res.body.cashMovement.cashRegisterId}`)
      }
    });

    toast('Comprobante Interno Creado');

    queryClient.invalidateQueries({ queryKey: ['products'] });
    setWarehouse(null);
    setClient(null);
    setPriceList(null);
    emptyCart();
    setActiveStep(1);

    navigate(`/panel/caja/detalles/venta/${res.body.cashMovement.id}`);

  };

  const onErrorAfip = (error: any) => {
    toast.error(error.response.data.body.message);
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
      toast.error('No hay suficiente stock en algunos productos');
    }
  };

  const { mutateAsync, isLoading } = useCreateCashMovement(onSuccess, cb);
  const { mutateAsync: createAfipInvoce } = useCreateAfipInvoce(onSuccessAfip, onErrorAfip);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () => toFormikValidationSchema(schema),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  const totalCarttotalShoppingCart = useCallback((values: any) => Math.round((Number.EPSILON + totalCartCopy + (values.otherTributes?.reduce((acc: any, el: any) => acc + Number(el.amount), 0) || 0))
    * 100) / 100, [totalCartCopy]);

  const applyDOrR = () => {
    if (Number(discount) <= 0 && Number(recharge) <= 0) return;

    if (Number(discount) > 0) {
      let totalToDiscount: number;

      if (!percent) {
        totalToDiscount = Number(discount);
      } else {
        totalToDiscount = subTotalCartCopy * Number(discount) / 100;
      }

      console.log(totalToDiscount * -1);
      recalculateCart(totalToDiscount * -1);
    } else if (Number(recharge) > 0) {
      let totalToRecharge: number;

      if (!percent) {
        totalToRecharge = Number(recharge);
      } else {
        totalToRecharge = subTotalCartCopy * Number(recharge) / 100;
      }

      recalculateCart(totalToRecharge);
    }

    setLockDOrR(true);
  };

  const resetDOrR = () => {
    setCartCopy(cart);
    setOption('1');
    setDiscount('0');
    setRecharge('0');
    setPercent(true);
    setLockDOrR(false);
    formik.setFieldValue('discharge', '0');
    formik.setFieldValue('recharge', '0');
    formik.setFieldValue('payments', []);
  };

  useEffect(() => {
    setCartCopy(cart);
  }, [cart]);

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md">
      {
        !paymentMethods || !invoceTypes || !otherTributes || !settings ? <Loading /> : (
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
                  <Stack gap={8} w="64%">

                    <Stack direction="row" pos='relative' w="full">
                      <Heading bg="gray.600" color="whitesmoke" rounded='md' textAlign='center' w="full">{invoceType?.description}</Heading>
                    </Stack>

                    <Stack border="1px solid whitesmoke" pb="4" pos='relative' px="4" rounded='md' w="full">
                      <Icon as={AiFillLock} boxSize={6} color={'blackAlpha.700'} display={values.payments?.length && values.payments.length > 0 || lockDOrR ? 'block' : 'none'} pos='absolute' right={1} top={1} />
                      <Icon as={AiFillUnlock} boxSize={6} color={'blackAlpha.700'} display={values.payments?.length && values.payments.length > 0 ? 'none' : 'block'} pos='absolute' right={1} top={1} />
                      <Box position='relative' px="4" py='8'>
                        <Divider />
                        <AbsoluteCenter bg='white' px="2">
                          <FormLabel htmlFor="option">Descuento/Recargo:</FormLabel>
                        </AbsoluteCenter>
                      </Box>
                      <Box>
                        <RadioGroup
                          name="option"
                          py={2}
                          value={option}
                          onChange={(e) => {
                            setOption(e);
                            setDiscount('0');
                            setRecharge('0');
                            formik.setFieldValue('discharge', '0');
                            formik.setFieldValue('recharge', '0');
                          }}
                        >
                          <Stack direction="row" gap="8">
                            <Radio isDisabled={(values.payments && values.payments?.length > 0 || lockDOrR)} value="1">No aplicar</Radio>
                            <Radio isDisabled={(values.payments && values.payments?.length > 0 || lockDOrR)} value="2">Aplicar Descuento</Radio>
                            <Radio isDisabled={(values.payments && values.payments?.length > 0 || lockDOrR)} value="3">Aplicar Recargo</Radio>
                          </Stack>
                        </RadioGroup>
                      </Box>

                      {
                        option !== "1" &&
                        <Flex direction="column" gap="8" justifyContent="space-between" >
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
                                  autoComplete='off'
                                  id="discount"
                                  isDisabled={(values.payments && values.payments?.length > 0 || lockDOrR)}
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
                                        isDisabled={(values.payments && values.payments?.length > 0 || lockDOrR)}
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
                                  autoComplete='off'
                                  id="recharge"
                                  isDisabled={(values.payments && values.payments?.length > 0 || lockDOrR)}
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
                                        isDisabled={(values.payments && values.payments?.length > 0 || lockDOrR)}
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
                          {
                            (Number(discount) > 0 || Number(recharge) > 0) && lockDOrR ? (

                              <Button
                                colorScheme="red"
                                size="md"
                                variant="outline"
                                onClick={resetDOrR}
                              >
                                <Icon as={BsCheckCircle} color="brand" mr="2" />
                                Eliminar {option === "2" ? "Descuento" : "Recargo"}
                              </Button>
                            ) : (
                              <Button
                                colorScheme="brand"
                                isDisabled={lockDOrR || (values.payments && values.payments?.length > 0)}
                                size="md"
                                variant="outline"
                                onClick={applyDOrR}
                              >
                                <Icon as={BsCheckCircle} color="brand" mr="2" />
                                Aplicar {option === "2" ? "Descuento" : "Recargo"}
                              </Button>
                            )
                          }
                        </Flex>
                      }
                    </Stack>
                    <Stack border="1px solid whitesmoke" pb="4" pos='relative' px="4" rounded='md' w="full">
                      <Icon as={FiAlertTriangle} boxSize={6} color={'red.500'} display={values.payments?.length && values.payments?.length > 0 ? 'none' : 'block'} pos='absolute' right={1} top={1} />
                      <Box position='relative' px="4" py='8'>
                        <Divider />
                        <AbsoluteCenter bg="white" px="2">
                          <FormLabel htmlFor="payments">Forma de Pago</FormLabel>
                        </AbsoluteCenter>
                      </Box>

                      <FieldArray
                        name="payments"
                        render={(arrayHelpers) => (
                          <Stack w="full">
                            {values.payments?.map((_, index) => (
                              <Stack key={index} w="full">
                                <Stack alignItems="flex-end" direction="row" w="full">
                                  <Box w={'29%'}>
                                    <InputGroup>
                                      <InputLeftAddon children="$" />
                                      <Input
                                        autoComplete='off'
                                        defaultValue={
                                          values.payments?.length === 1 ?
                                            totalCarttotalShoppingCart(values)
                                            : values.payments &&
                                            Math.round((Number(values.payments[index].amount)) * 100) / 100

                                        }
                                        id={`payments[${index}].amount`}
                                        name={`payments[${index}].amount`}
                                        placeholder='importe'
                                        onChange={handleChange}
                                        onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                                      />
                                    </InputGroup>
                                  </Box>

                                  <Box w='59%'>
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
                                  <Button flex={1} onClick={() => arrayHelpers.remove(index)}>
                                    <Icon as={FaRegTrashAlt} color="brand" ml="0 auto" />
                                  </Button>
                                </Stack>
                                {Array.isArray(errors.payments) && (
                                  <ErrorMessage>{errors.payments[index]['amount']}</ErrorMessage>
                                )}
                              </Stack>

                            ))}

                            <Button
                              colorScheme="brand"
                              isDisabled={
                                totalCarttotalShoppingCart(values)
                                <= (values.payments?.reduce((acc, el) => acc + Number(el.amount), 0) || 0)
                              }
                              size="md"
                              variant="outline"
                              onClick={() => {
                                formik.setFieldValue('otherTributes', values.otherTributes?.filter(el => Number(el.amount) > 0));
                                arrayHelpers.push({
                                  amount:
                                    totalCarttotalShoppingCart(values)
                                    - (values.payments?.reduce((acc, el) => acc + Number(el.amount), 0) || 0),
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
                      {typeof errors.payments === 'string' && (
                        <ErrorMessage>{errors.payments}</ErrorMessage>
                      )}
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
                      <Stack alignItems="center" direction='row' justifyContent="flex-end" w="full">
                        <Text textAlign="right" w="80%" >
                          Subtotal
                        </Text>
                        <Text fontSize={24} textAlign="right" w="20%">
                          {formatCurrency(subTotalCartCopy)}
                        </Text>
                      </Stack>

                      <Stack alignItems="center" direction='row' justifyContent="flex-end" w="full">
                        <Text textAlign="right" w="80%" >
                          IVA
                        </Text>
                        <Text fontSize={24} textAlign="right" w="20%">
                          {formatCurrency(totalIvaCartCopy)}
                        </Text>
                      </Stack>
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
                        <Text fontSize={24} fontWeight="semibold" textAlign="right">
                          {formatCurrency(totalCartCopy + (values.otherTributes?.reduce((acc, el) => acc + Number(el.amount), 0) || 0))}
                        </Text>
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
                      <Stack maxH="680px" overflowY="auto">
                        {cartCopy.map((item) => {
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
                                {
                                  iva &&
                                  <Text px="2">
                                    iva: {formatCurrency(item.price * item.quantity * item.tax)} ({item.tax * 100}%)
                                  </Text>
                                }
                                <Text px="2" textDecoration="underline">
                                  subtotal: {formatCurrency(item.price * item.quantity * (1 + item.tax))}
                                </Text>
                              </Box>
                            </Stack>
                          );
                        })}
                      </Stack>
                      <Divider />
                      <Stack alignItems="center" direction='row' justifyContent="flex-end" w="full">
                        <Text textAlign="right" w="50%" >
                          Subtotal
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" textAlign="right" w="50%">
                          {formatCurrency(subTotalCartCopy)}
                        </Text>
                      </Stack>
                      <Stack alignItems="center" direction='row' justifyContent="flex-end" w="full">
                        <Text textAlign="right" w="50%" >
                          IVA
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" textAlign="right" w="50%">
                          {formatCurrency(totalIvaCartCopy)}
                        </Text>
                      </Stack>
                      <Divider />
                      <Stack alignItems="center" direction='row' justifyContent="flex-end" w="full">
                        <Text textAlign="right" w="50%" >
                          TOTAL
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" textAlign="right" w="50%">
                          {formatCurrency(totalCartCopy)}
                        </Text>
                      </Stack>
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
