import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { AppProvider } from './context';
import { AppRouter } from './router';
import theme from './theme';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider resetCSS theme={theme}>
          <AppRouter />
        </ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </AppProvider>
  );
};

export default App;
