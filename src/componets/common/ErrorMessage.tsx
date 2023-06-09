import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ErrorMessage = ({ children }: Props) => {
  return (
    <Text
      //as="span"
      //bg="red.500"
      color="red.500"
      fontSize="xs"
      fontWeight="semibold"
      //my="1"
      px="1"
    >
      {children}
    </Text>
  );
};
