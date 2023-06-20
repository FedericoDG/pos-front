import { Stack, Text } from '@chakra-ui/react';

import { usePurchasesContext } from '.';

export const Card = () => {
  const { supplier, warehouse } = usePurchasesContext();

  return (
    <Stack
      alignItems="flex-start"
      bg="white"
      direction="row"
      justifyContent="space-between"
      p="4"
      rounded="md"
      shadow="md"
      w="full"
    >
      <Stack
        bg="gray.700"
        color="whitesmoke"
        fontSize="md"
        lineHeight="1"
        p="2"
        rounded="md"
        w="420px"
      >
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">CUIT:</Text>
          <Text>{supplier?.cuit}</Text>
        </Stack>
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">NOMBRE:</Text>
          <Text>{supplier?.name}</Text>
        </Stack>
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">TELÉFONO:</Text>
          <Text>{supplier?.phone}</Text>
        </Stack>
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">CELULAR:</Text>
          <Text>{supplier?.mobile}</Text>
        </Stack>
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">EMAIL:</Text>
          <Text>{supplier?.email}</Text>
        </Stack>
      </Stack>
      <Stack
        bg="gray.700"
        color="whitesmoke"
        fontSize="md"
        lineHeight="1"
        p="2"
        rounded="md"
        w="420px"
      >
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">DEPÓSITO:</Text>
          <Text>{warehouse?.code}</Text>
        </Stack>
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">DESCRIPCIÓN:</Text>
          <Text>{warehouse?.description}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
