import { BsArrowRight } from 'react-icons/bs';
import { Stack, Text, Icon } from '@chakra-ui/react';

import { useProductTransContext } from '.';

export const Card = () => {
  const { warehouse, warehouse2 } = useProductTransContext();

  return (
    <Stack
      alignItems="center"
      bg="white"
      direction="row"
      justifyContent="space-between"
      mb="2"
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
          <Text fontWeight="semibold">DEPÓSITO:</Text>
          <Text>{warehouse?.code}</Text>
        </Stack>
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">DESCRIPCIÓN:</Text>
          <Text>{warehouse?.description}</Text>
        </Stack>
      </Stack>

      <Icon as={BsArrowRight} boxSize={14} />

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
          <Text>{warehouse2?.code}</Text>
        </Stack>
        <Stack direction="row" justifyContent="space-between" w="full">
          <Text fontWeight="semibold">DESCRIPCIÓN:</Text>
          <Text>{warehouse2?.description}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
