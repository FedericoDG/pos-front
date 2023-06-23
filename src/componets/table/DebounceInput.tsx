import { CloseIcon, Search2Icon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useMyContext } from '../../context';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange: (val: string | number) => void;
  debounceTime?: number;
  placeholder?: string;
}

export const DebouncedInput = ({
  debounceTime = 300,
  onChange,
  placeholder = 'Buscar...',
  value: initialValue,
}: Props) => {
  const [value, setValue] = useState(initialValue);

  // setValue if any initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // debounce onChange — triggered on every keypress
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounceTime);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, onChange, debounceTime]);

  const { tableInput } = useMyContext();

  const handleClick = () => {
    setValue('');
    tableInput.current.focus();
  };

  return (
    <InputGroup rounded="md" w={300}>
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="gray.400" />
      </InputLeftElement>
      <Input
        ref={tableInput}
        autoFocus
        _dark={{ bg: 'gray.600', color: 'whitesmoke' }}
        bg="blackAlpha.50"
        colorScheme="brand"
        placeholder={placeholder}
        value={value}
        variant="outline"
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <InputRightElement width="4.5rem">
          <CloseIcon boxSize={3} color="red.300" cursor="pointer" onClick={handleClick} />
        </InputRightElement>
      )}
    </InputGroup>
  );
};
