import { Button, Icon } from '@chakra-ui/react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export const PagButton = (props: any) => {
  const activeStyle = {
    bg: 'gray.300',
    color: 'white',
  };

  return (
    <Button
      _hover={!props.isDisabled && activeStyle}
      bg="whitesmoke"
      color="gray.800"
      cursor={props.isDisabled && 'not-allowed'}
      mx={1}
      opacity={props.isDisabled && 0.6}
      px={2}
      py={0}
      rounded="lg"
      size="sm"
      {...(props.active && activeStyle)}
      {...props}
    >
      <Icon
        _dark={{ color: 'gray.200' }}
        as={props.left ? IoIosArrowBack : IoIosArrowForward}
        boxSize={5}
        color="gray.700"
      />
    </Button>
  );
};
