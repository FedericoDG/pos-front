import { Box, Heading, Stack, Text, Button, Divider, Icon } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { formatCurrency } from '../../utils';
import { CashMovement } from '../../interfaces/interfaces';
import { CreditNote, useCreateAfipCreditNote, useCreateAfipCreditNoteX } from '../../hooks';

import { usePosContext } from './context';

interface Props {
  cashMovement: CashMovement;
}

export const Basket = ({ cashMovement }: Props) => {
  const { cart, removeItem, totalCart, totalCartItems, goToNext, addItem } = usePosContext();

  const navigate = useNavigate();

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

  const onSuccessAfip = (res: any) => {
    if (cashMovement.iva) {
      navigate(`/panel/caja/detalles/venta/afip/${res.body.cashMovement.id}`, { replace: true });
      toast.success('Nota de Crédito Creada', {
        action: {
          label: 'Ver',
          onClick: () => navigate(`/panel/caja/detalles/${res.body.cashMovement.cashRegisterId}`),
        },
      });
    } else {
      navigate(`/panel/caja/detalles/venta/${res.body.cashMovement.id}`, { replace: true });
      toast.success('Nota de Crédito Creada', {
        action: {
          label: 'Ver',
          onClick: () => navigate(`/panel/caja/detalles/${res.body.cashMovement.cashRegisterId}`),
        },
      });
    }
  };

  const onErrorAfip = (error: any) => {
    toast.error(error.response.data.body.message);
  };

  const { mutateAsync } = useCreateAfipCreditNote(onSuccessAfip, onErrorAfip);
  const { mutateAsync: mutateAsyncX } = useCreateAfipCreditNoteX(onSuccessAfip, onErrorAfip);

  const handleSubmit = () => {
    const sale = {} as CreditNote;

    sale.cart = cart.map((item) => ({
      productId: item.productId!,
      quantity: Number(item.quantity),
      price: Number(item.price),
      tax: Number(item.tax),
    }));

    sale.cashMovementId = cashMovement.id!;
    sale.clientId = cashMovement.clientId;
    sale.warehouseId = cashMovement.warehouseId;
    sale.discount = 0;
    sale.recharge = 0;
    sale.payments = [{ amount: totalCart, paymentMethodId: 1 }];
    sale.info = '';
    sale.invoceTypeId = cashMovement.invoceIdAfip!;
    sale.invoceNumber = cashMovement.invoceNumberAfip!;

    if (cashMovement.iva) {
      mutateAsync(sale);
    } else {
      mutateAsyncX(sale);
    }
  };

  return (
    <Stack
      bg="white"
      border="1px solid whitesmoke"
      justifyContent="center"
      pb="4"
      px="4"
      rounded="md"
      w="35%"
    >
      {cart.length > 0 ? (
        <Stack w="full">
          <Heading color="brand.500" fontSize="28" pt="2" textAlign="center">
            LISTA DE PRODUCTOS
          </Heading>
          <Stack maxH="448px" overflowY="auto">
            {cart.map((item) => {
              return (
                <Stack key={nanoid()} fontFamily="mono" fontSize={14} position="relative" py="1">
                  <Box px="2">
                    <Stack
                      alignItems="center"
                      bg={'brand.700'}
                      direction="row"
                      justifyContent="space-between"
                      px="2"
                    />
                    <Text px="2">
                      cantidad: {item.quantity} {item.product?.unit?.code}
                    </Text>
                    <Text px="2">precio: {formatCurrency(item.price)}</Text>
                    <Text px="2">
                      iva: {formatCurrency(item.price * item.quantity * item.tax)} ({item.tax * 100}
                      %)
                    </Text>
                    <Text px="2" textDecoration="underline">
                      subtotal: {formatCurrency(item.price * item.quantity * (1 + item.tax))}
                    </Text>
                  </Box>
                  <Box position="absolute" right={0} top={'50%'}>
                    <Button
                      colorScheme="red"
                      fontSize={14}
                      leftIcon={<ImCancelCircle />}
                      pr="3"
                      size={'xs'}
                      variant="ghost"
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
          <Text fontFamily="mono" fontSize="xl" fontWeight="bold" px="2" textAlign="right">
            {formatCurrency(totalCart)}
          </Text>
          <Text fontFamily="mono" fontSize="xl" fontWeight="normal" px="2" textAlign="right">
            productos: ({totalCartItems})
          </Text>
          <Stack p="2">
            <Button
              colorScheme="brand"
              // rightIcon={<ArrowForwardIcon />}
              size="lg"
              variant="solid"
              w="full"
              onClick={handleSubmit}
            >
              CREAR NOTA DE CRÉDITO
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack alignItems={'center'} display={'flex'} justifyContent={'center'}>
          <Heading color="gray.300" fontSize="28" pt="2" textAlign="center">
            LISTA VACÍA
          </Heading>
          <Icon as={MdOutlineRemoveShoppingCart} boxSize={240} color="gray.300" />
          <Heading color="gray.300" fontSize="24" pt="2" textAlign="center">
            AGREGUE PRODUCTOS
          </Heading>
          <Button
            colorScheme="brand"
            onClick={() => {
              cashMovement.cashMovementDetails?.forEach((detail) =>
                addItem({ ...detail, quantity: detail.quantity })
              );
            }}
          >
            AGREGAR TODOS
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
