import { Stack, Text } from '@chakra-ui/react';

import { useDischargesContext } from '.';

export const Card = () => {
  const { warehouse } = useDischargesContext();

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
          <Text fontWeight="semibold">CHOFER:</Text>
          <Text>{warehouse?.code}</Text>
        </Stack>
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">APELLIDO:</Text>
          <Text>{warehouse?.user?.lastname}</Text>
        </Stack>
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">NOMBRE:</Text>
          <Text>{warehouse?.user?.name}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
