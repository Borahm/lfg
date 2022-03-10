import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { ChakraProvider, extendTheme, Center, Container } from '@chakra-ui/react'


export const theme = extendTheme({
  components: {
    Toast: {
      defaultProps: {
        colorScheme: 'purple',
      },
    },
  },
})

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Center>
      <Container maxWidth='100%' padding={0} mb='0' centerContent>
        <App />
      </Container>
    </Center>
  </ChakraProvider>, document.getElementById('root'))
