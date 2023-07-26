/* eslint-disable react/no-children-prop */
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
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

import { ErrorMessage } from '../common';
import { schema } from '../categories';
import { useCreateCashMovement, useGetPaymentMethods } from '../../hooks';
import { formatCurrency } from '../../utils';

import { usePosContext } from '.';

interface Payment {
  amount: string;
  paymentMethodId: string;
}

interface Values {
  discount: number | null;
  recharge: number | null;
  info: string;
  payments: Payment[];
}

interface Sale {
  clientId: number;
  warehouseId: number;
  discount?: number;
  recharge?: number;
  cart: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  payments: {
    amount: number;
    paymentMethodId: number;
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
  const [option, setOption] = useState('1');
  const [discount, setDiscount] = useState(0);
  const [recharge, setRecharge] = useState(0);
  const [percent, setPercent] = useState(true);

  const {
    cart,
    client,
    emptyCart,
    setActiveStep,
    setClient,
    setWarehouse,
    warehouse,
    setPriceList,
    totalCart,
  } = usePosContext();

  const initialValues: Values = {
    discount: 0,
    recharge: 0,
    info: '',
    payments: [{ amount: totalCart.toString(), paymentMethodId: '1' }],
  };

  const queryClient = useQueryClient();

  const onSubmit = (values: Values) => {
    const parsedValues = {
      discount: Number(values.discount),
      recharge: Number(values.recharge),
    };

    const sale: Sale = {
      clientId: Number(client?.id!),
      warehouseId: Number(warehouse?.id!),
      cart: cart.map((item) => ({
        productId: item.id!,
        quantity: item.quantity,
        price: item.price,
      })),
      payments: values.payments.map((item) => ({
        amount: Number(item.amount),
        paymentMethodId: Number(item.paymentMethodId),
      })),
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
      mutate(sale);
    }
  };

  const onSuccess = () => {
    toast.info('Venta realizada', {
      theme: 'colored',
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 3000,
      closeOnClick: true,
    });
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

  const { mutate } = useCreateCashMovement(onSuccess);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () => toFormikValidationSchema(schema),
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors } = formik;

  const { data: paymentMethods } = useGetPaymentMethods();

  if (!paymentMethods) return null;

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md">
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <Stack spacing="14px">
            <Flex gap="8" justifyContent="space-between">
              <Box w="50%">
                <FieldArray
                  name="payments"
                  render={(arrayHelpers) => (
                    <Stack w="full">
                      {values.payments.map((_friend, index) => (
                        <Stack key={index} alignItems="flex-end" direction="row" w="full">
                          {/* <Field name={`friends[${index}].name`} /> */}
                          <Box w={values.payments.length > 1 ? '44%' : '50%'}>
                            <FormLabel htmlFor={`payments[${index}].amount`}>Importe:</FormLabel>
                            <Input
                              autoFocus
                              defaultValue={
                                values.payments.length === 1
                                  ? totalCart
                                  : values.payments[index].amount
                              }
                              id={`payments[${index}].amount`}
                              name={`payments[${index}].amount`}
                              onChange={handleChange}
                              onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                            />
                            {typeof errors.payments === 'string' && (
                              <ErrorMessage>{errors.payments}</ErrorMessage>
                            )}
                          </Box>

                          <Box w={values.payments.length > 1 ? '44%' : '50%'}>
                            <FormLabel htmlFor={`payments.${index}.paymentMethodId`}>
                              Forma de Pago:
                            </FormLabel>
                            <Select
                              autoFocus
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
                            <Box w="9%">
                              <Button onClick={() => arrayHelpers.remove(index)}>
                                <Icon as={FaRegTrashAlt} color="brand" m="0 auto" />
                              </Button>
                            </Box>
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
              </Box>
              <Stack w="50%">
                <Box>
                  <FormLabel htmlFor="option">Descuento/Recargo:</FormLabel>
                  <RadioGroup
                    defaultValue={option}
                    name="option"
                    py={2}
                    onChange={(e) => {
                      setOption(e);
                      setDiscount(0);
                      setRecharge(0);
                    }}
                  >
                    <Stack direction="row" gap="8">
                      <Radio value="1">No aplicar</Radio>
                      <Radio value="2">Aplicar Descuento</Radio>
                      <Radio value="3">Aplicar Recargo</Radio>
                    </Stack>
                  </RadioGroup>
                </Box>

                <Flex gap="8" justifyContent="space-between">
                  <Box w="full">
                    {option === '2' && (
                      <>
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
                              setDiscount(Number(e.target.value));
                              setRecharge(0);
                            }}
                            onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                          />
                          <InputRightAddon
                            children={
                              <Tooltip label="Aternar entre porcentaje y valor">
                                <Button
                                  onClick={() => {
                                    setPercent((current) => !current);
                                    setDiscount(0);
                                    setRecharge(0);
                                  }}
                                >
                                  <Icon as={CgArrowsExchangeAlt} />
                                </Button>
                              </Tooltip>
                            }
                            p="0"
                          />
                        </InputGroup>
                      </>
                    )}
                    {option === '3' && (
                      <>
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
                              setRecharge(Number(e.target.value));
                              setDiscount(0);
                            }}
                            onFocus={(event) => setTimeout(() => event.target.select(), 100)}
                          />
                          <Tooltip label="Aternar entre porcentaje y valor">
                            <InputRightAddon
                              children={
                                <Button
                                  onClick={() => {
                                    setPercent((current) => !current);
                                    setDiscount(0);
                                    setRecharge(0);
                                  }}
                                >
                                  <Icon as={CgArrowsExchangeAlt} />
                                </Button>
                              }
                              p="0"
                            />
                          </Tooltip>
                        </InputGroup>
                      </>
                    )}
                  </Box>
                </Flex>

                <Box>
                  <FormLabel htmlFor="info">Información extra:</FormLabel>
                  <Textarea
                    defaultValue={initialValues.info}
                    id="info"
                    name="info"
                    placeholder="Info extra..."
                    onChange={handleChange}
                  />
                </Box>
              </Stack>
            </Flex>
          </Stack>

          <Stack p="4">
            <Text fontSize={24} textAlign="right">
              {formatCurrency(totalCart)}
            </Text>
            {option === '2' && percent ? (
              <Text fontSize={18} textAlign="right">
                {formatCurrency(((totalCart * discount) / 100) * -1)}
              </Text>
            ) : (
              option === '2' && (
                <Text fontSize={18} textAlign="right">
                  {formatCurrency(discount * -1)}
                </Text>
              )
            )}

            {option === '3' && percent ? (
              <Text fontSize={18} textAlign="right">
                {formatCurrency((totalCart * recharge) / 100)}
              </Text>
            ) : (
              option === '3' && (
                <Text fontSize={18} textAlign="right">
                  {formatCurrency(recharge)}
                </Text>
              )
            )}
            <Divider ml="auto" w="50%" />
            <Flex justifyContent="space-between" ml="auto" w="50%">
              <Text fontSize={24}>TOTAL:</Text>
              {percent ? (
                <Text fontSize={24} fontWeight="semibold" textAlign="right">
                  {formatCurrency(
                    totalCart + (totalCart * recharge) / 100 - (totalCart * discount) / 100
                  )}
                </Text>
              ) : (
                <Text fontSize={24} fontWeight="semibold" textAlign="right">
                  {formatCurrency(totalCart + recharge - discount)}
                </Text>
              )}
            </Flex>
          </Stack>

          <Stack direction="row" mt="8">
            <Button mr={3} type="reset" variant="outline" w="full" onClick={onReset}>
              CANCELAR
            </Button>
            <Button colorScheme="brand" type="submit" w="full">
              CARGAR VENTA
            </Button>
          </Stack>
          <AutoSubmit />
        </form>
      </FormikProvider>
    </Stack>
  );
};
