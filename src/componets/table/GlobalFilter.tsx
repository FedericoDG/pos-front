import { Dispatch } from 'react';

import { DebouncedInput } from '.';

interface Props {
  setGlobalFilter: Dispatch<React.SetStateAction<string>>;
  globalFilter: string;
}

export const GlobalFilter = ({ globalFilter, setGlobalFilter }: Props) => {
  return (
    <DebouncedInput
      value={globalFilter ?? ''}
      onChange={(value) => setGlobalFilter(String(value))}
    />
  );
};
