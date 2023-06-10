/* eslint-disable prettier/prettier */
import { Checkbox } from '@chakra-ui/react';
import { HTMLProps, useRef, useEffect } from 'react';

export const IndeterminateCheckbox = ({
  indeterminate,
  ...rest
}: { indeterminate?: boolean; } & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return <Checkbox
    ref={ref}
    colorScheme='blue'
    cursor='pointer'
    isChecked={rest.checked}
    isDisabled={rest.disabled}
    isIndeterminate={indeterminate}
    px="1"
    size='lg'
    onChange={rest.onChange}
  />;
};
