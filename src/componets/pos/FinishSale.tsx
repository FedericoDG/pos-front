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
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useState } from 'react';
import { CgArrowsExchangeAlt } from 'react-icons/cg';

import { schema } from '../categories';
import { useCreateCashMovement, useGetPaymentMethods } from '../../hooks';
import { formatCurrency } from '../../utils';

import { usePosContext } from '.';

interface Values {
  paymentMethodId: number;
  discount: number | null;
  recharge: number | null;
  info: string;
}

interface Sale {
  clientId: number;
  warehouseId: number;
  paymentMethodId: number;
  discount?: number;
  recharge?: number;
  cart: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}

export const FinishSale = () => {
  const [option, setOption] = useState('1');
  const [discount, setDiscount] = useState(0);
  const [recharge, setRecharge] = useState(0);
  const [percent, setPercent] = useState(false);

  const initialValues: Values = {
    paymentMethodId: 1,
    discount: 0,
    recharge: 0,
    info: '',
  };

  const {
    cart,
    client,
    emptyCart,
    setActiveStep,
    setClient,
    setWarehouse,
    warehouse,
    setPriceList,
    goToPrevious,
    totalCart,
  } = usePosContext();

  const queryClient = useQueryClient();

  const onSubmit = (values: Values) => {
    const parsedValues = {
      paymentMethodId: Number(values.paymentMethodId),
      discount: Number(values.discount),
      recharge: Number(values.recharge),
    };

    const sale: Sale = {
      clientId: Number(client?.id!),
      warehouseId: Number(warehouse?.id!),
      paymentMethodId: parsedValues.paymentMethodId,
      cart: cart.map((item) => ({
        productId: item.id!,
        quantity: item.quantity,
        price: item.price,
      })),
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

    console.log(sale);
    mutate(sale);
  };

  const onSuccess = () => {
    toast.info('Venta realizada', {
      theme: 'colored',
      position: toast.POSITION.BOTTOM_CENTER,
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

  const { handleSubmit, handleChange } = formik;

  const { data: paymentMethods } = useGetPaymentMethods();

  if (!paymentMethods) return null;

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md">
      <form onSubmit={handleSubmit}>
        <Stack spacing="14px">
          <Flex gap="8" justifyContent="space-between">
            <Box w="50%">
              <FormLabel htmlFor="paymentMethodId">Forma de Pago:</FormLabel>
              <Select
                autoFocus
                defaultValue={initialValues.paymentMethodId}
                id="paymentMethodId"
                minW="224px"
                name="paymentMethodId"
                onChange={handleChange}
              >
                {paymentMethods.map((method) => (
                  <option key={method.code} value={method.id}>
                    {method.code}
                  </option>
                ))}
              </Select>
            </Box>

            <Box w="50%">
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
          </Flex>
          <Flex gap="8" justifyContent="space-between">
            <Box w="50%">
              <FormLabel htmlFor="info">Información extra:</FormLabel>
              <Textarea
                defaultValue={initialValues.info}
                id="info"
                name="info"
                placeholder="Info extra..."
                onChange={handleChange}
              />
            </Box>
            <Box w="50%">
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
      </form>
    </Stack>
  );
};
