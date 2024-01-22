import { Heading, Stack } from '@chakra-ui/react';
interface Props {
  minH?: string;
}

export const Loading = ({ minH }: Props) => {
  return (
    <Stack align="center" justifyContent="center" minH={minH || '70vh'}>
      <div className="loader" />
      <Heading color="brand.200" size="md">
        CARGANDO
      </Heading>
    </Stack>
  );
};
