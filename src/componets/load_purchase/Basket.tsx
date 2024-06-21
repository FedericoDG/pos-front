import { Box, Heading, Stack, Text, Button, Divider } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

import { formatCurrency } from '../../utils';
import { useCreatePurchase } from '../../hooks';

import { usePurchasesContext } from './context';

export const Basket = () => {
  const {
    cart,
    driver,
    emptyCart,
    removeItem,
    setActiveStep,
    setDriver,
    setSupplier,
    setTransport,
    setWarehouse,
    supplier,
    totalCart,
    totalCartItems,
    transport,
    warehouse,
  } = usePurchasesContext();
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
    toast.success('Compra cargada');
    emptyCart();
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setSupplier(null);
    setWarehouse(null);
    setDriver('');
    setTransport('');
    setActiveStep(1);
  };

  const onError = () => {
    toast.error('Ocurrió un problema. No se pudo cargar la compra');
    //emptyCart();
    queryClient.invalidateQueries({ queryKey: ['products'] });
    //setSupplier(null);
    // setWarehouse(null);
    // setDriver('');
    // setTransport('');
    // setActiveStep(1);
  };

  const { mutate, isLoading } = useCreatePurchase(onSuccess, onError);

  if (cart.length === 0) return null;

  return (
    <Stack bg="white" border="1px solid whitesmoke" p="4" rounded="md" w="35%">
      <Heading color="brand.500" fontSize="28" textAlign="center">
        Lista de Productos
      </Heading>
      <Stack maxH="410px" overflowY="auto">
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
                  QUITAR
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
      <Button
        colorScheme="brand"
        isDisabled={isLoading}
        isLoading={isLoading}
        loadingText="CARGANDO COMPRA"
        variant="solid"
        w="full"
        onClick={handleSubmit}
      >
        CARGAR COMPRA
      </Button>
    </Stack>
  );
};
