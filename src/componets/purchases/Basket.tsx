import { Box, Heading, Stack, Text, Button, Divider } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { formatCurrency } from '../../utils';
import { useCreatePurchase } from '../../hooks';

import { usePurchaseContext } from '.';

export const Basket = () => {
  const {
    cart,
    driver,
    emptyCart,
    removeItem,
    setDriver,
    setSupplier,
    setTransport,
    setWarehouse,
    supplier,
    totalCart,
    totalCartItems,
    transport,
    warehouse,
  } = usePurchaseContext();
  const queryClient = useQueryClient();

  const handleSubmit = () => {
    const purchase = {
      supplierId: supplier?.id!,
      warehouseId: warehouse?.id!,
      driver,
      transport,
      total: totalCart,
      date: new Date(),
      cart: cart.map((item) => ({
        productId: item.id!,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    mutate(purchase);
  };

  const onSuccess = () => {
    toast.success('Compra cargada', {
      theme: 'light',
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      closeOnClick: true,
    });
    emptyCart();
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setSupplier(null);
    setWarehouse(null);
    setDriver('');
    setTransport('');
  };
  const { mutate } = useCreatePurchase(onSuccess);

  if (cart.length === 0) return null;

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md" w="35%">
      <Heading color="brand.500" fontSize="28" textAlign="center">
        Lista de Productos
      </Heading>
      <Stack maxH="432px" overflowY="auto">
        {cart.map((item) => {
          return (
            <Stack key={nanoid()} fontFamily="mono" fontSize={14} position="relative" py="1">
              <Box>
                <Text fontWeight="bold">{item.name}</Text>
                <Text>
                  cantidad: {item.quantity} {item.unit?.code}
                </Text>
                <Text>precio: {formatCurrency(item.price)}</Text>
                <Text textDecoration="underline">
                  subtotal: {formatCurrency(item.price * item.quantity)}
                </Text>
              </Box>
              <Box position="absolute" right={0} top={'50%'}>
                <Button
                  colorScheme="red"
                  fontSize={14}
                  pr="2"
                  variant="link"
                  onClick={() => removeItem(item.id!)}
                >
                  ELIMINAR
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
        CARGAR COMPRA
      </Button>
    </Stack>
  );
};
