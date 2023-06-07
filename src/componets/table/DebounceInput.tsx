import { CloseIcon, Search2Icon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useState } from 'react';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange: (val: string | number) => void;
  debounceTime?: number;
  placeholder?: string;
}

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounceTime = 300,
  placeholder = 'Buscar...',
}: Props) => {
  const [value, setValue] = useState(initialValue);

  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const handleClick = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <InputGroup boxShadow="md" maxW={250} rounded="md">
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="gray.400" />
      </InputLeftElement>
      <Input
        ref={inputRef}
        autoFocus
        _focus={{ bg: 'white' }}
        _hover={{ bg: 'white' }}
        bg="white"
        placeholder={placeholder}
        value={value}
        variant="filled"
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
