import React from "react";
import { Box, Image, Link, Text } from "@chakra-ui/react";

const Logo = (props) => {
  return (
    <Box {...props} >
      <Link href='/'>
        <Box width='160px'>
          <Text color='black'>LFG</Text>
        </Box>
      </Link>
    </Box>
  )
}

export default Logo