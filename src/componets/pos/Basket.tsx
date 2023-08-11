import { Box, Heading, Stack, Text, Button, Divider } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { WarningIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';

import { formatCurrency } from '../../utils';
import { useCheckCart } from '../../hooks';

import { usePosContext } from './context';

interface Props {
  refetch: () => void;
}

export const Basket = ({ refetch }: Props) => {
  const { cart, removeItem, totalCart, totalCartItems, goToNext, warehouse, updateCartWithError } =
    usePosContext();

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return goToNext();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [goToNext]);

  const cb = (error: number[]) => {
    if (error.length > 0) {
      updateCartWithError(error);
      refetch();
      toast.error('No hay suficiente stock en algunos productos', {
        theme: 'colored',
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 5000,
        closeOnClick: true,
      });
    } else {
      goToNext();
    }
  };

  const { mutate } = useCheckCart(cb);

  const handleSubmit = () => {
    const mappedCart = cart.map((item) => ({
      productId: item.id!,
      quantity: item.quantity,
      price: item.price,
      allow: item.allownegativestock === 'ENABLED' ? true : false,
    }));

    mutate({ warehouseId: warehouse?.id!, cart: mappedCart });
  };

  if (cart.length === 0) return null;

  return (
    <Stack bg="white" rounded="md" shadow="md" w="35%">
      <Heading color="brand.500" fontSize="28" pt="2" textAlign="center">
        Lista de Productos
      </Heading>
      <Stack maxH="410px" overflowY="auto">
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
                  {item.error && <WarningIcon color="white" h={4} marginX="1" w={4} />}
                </Stack>
                <Text px="2">
                  cantidad: {item.quantity} {item.unit?.code}
                </Text>
                <Text px="2">precio: {formatCurrency(item.price)}</Text>
                <Text px="2" textDecoration="underline">
                  subtotal: {formatCurrency(item.price * item.quantity)}
                </Text>
              </Box>
              <Box position="absolute" right={0} top={'50%'}>
                <Button
                  colorScheme="red"
                  fontSize={14}
                  pr="3"
                  variant="link"
                  onClick={() => removeItem(item.id!)}
                >
                  Quitar
                </Button>
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
      <Stack p="2">
        <Button colorScheme="brand" variant="solid" w="full" onClick={handleSubmit}>
          IR A FINALIZAR VENTA
        </Button>
      </Stack>
    </Stack>
  );
};
