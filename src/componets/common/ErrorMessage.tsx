import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ErrorMessage = ({ children }: Props) => {
  return (
    <Text color="red.500" fontSize="xs" fontWeight="semibold" px="1">
      {children}
    </Text>
  );
};
