import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { ChakraProvider, extendTheme, Center, Container } from '@chakra-ui/react'


export const theme = extendTheme({
  semanticTokens: {
    colors: {
      title: {
        default: 'gray.700',
        _dark: 'red.400'
      },
      text: {
        default: 'gray.600',
        _dark: 'red.700'
      },
      background: {
        default: 'gray.100',
        _dark: 'red.700'
      },
      accent: {
        default: 'purple.500',
        _dark: 'red.700'
      },
    }
  }
})

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Center>
      <Container maxWidth='100%' padding={0} mb='0' centerContent>
        <App />
      </Container>
    </Center>
  </ChakraProvider>, document.getElementById('root'))
