import { Box, Heading, Stack, Text, Button, Divider } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';
import { useQueryClient } from 'react-query';

import { formatCurrency } from '../../utils';
import { useCreateDischarge } from '../../hooks';

import { useDischargesContext } from './context';

export const Basket = () => {
  const {
    cart,
    emptyCart,
    removeItem,
    setActiveStep,
    setWarehouse,
    totalCart,
    totalCartItems,
    warehouse,
  } = useDischargesContext();
  const queryClient = useQueryClient();

  const handleSubmit = () => {
    const discharge = {
      warehouseId: warehouse?.id!,
      //date: new Date(),
      cart: cart.map((item) => ({
        productId: item.productId,
        reasonId: item.reasonId,
        quantity: item.quantity,
        cost: item.cost,
        info: item.info,
      })),
    };

    mutate(discharge);
  };

  const onSuccess = () => {
    toast.info('Pérdida de stock cargada', {
      theme: 'colored',
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 3000,
      closeOnClick: true,
    });
    emptyCart();
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setWarehouse(null);
    setActiveStep(1);
  };
  const { mutate } = useCreateDischarge(onSuccess);

  if (cart.length === 0) return null;

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md" w="35%">
      <Heading color="brand.500" fontSize="28" textAlign="center">
        Lista de Productos
      </Heading>
      <Stack maxH="410px" overflowY="auto">
        {cart.map((item) => {
          return (
            <Stack key={nanoid()} fontFamily="mono" fontSize={14} position="relative" py="1">
              <Box>
                <Text fontWeight="bold">{item.products.name}</Text>
                <Text>
                  cantidad: {item.quantity} {item.products.unit?.code}
                </Text>
                <Text>precio: {formatCurrency(item.cost)}</Text>
                <Text textDecoration="underline">
                  subtotal: {formatCurrency(item.cost * item.quantity)}
                </Text>
              </Box>
              <Box position="absolute" right={0} top={'50%'}>
                <Button
                  colorScheme="red"
                  fontSize={14}
                  pr="2"
                  variant="link"
                  onClick={() => removeItem(item.productId)}
                >
                  Quitar
                </Button>
              </Box>
            </Stack>
          );
        })}
      </Stack>
      <Divider />
      <Text fontFamily="mono" fontSize="xl" fontWeight="bold" textAlign="right">
        {formatCurrency(totalCart)}
      </Text>
      <Text fontFamily="mono" fontSize="xl" fontWeight="normal" textAlign="right">
        productos: ({totalCartItems})
      </Text>
      <Button colorScheme="brand" variant="solid" w="full" onClick={handleSubmit}>
        CARGAR PÉRDIDA DE STOCK
      </Button>
    </Stack>
  );
};
