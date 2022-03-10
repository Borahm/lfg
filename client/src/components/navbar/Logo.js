import React from "react";
import { Box, Image, Link, Text } from "@chakra-ui/react";

const Logo = (props) => {
  return (
    <Box {...props} >
      <Link href='/'>
        <Box width='100px'>
          <Image src='https://res.cloudinary.com/dxd82e0ky/image/upload/v1646922268/lfg/Group_v4lne9.png' alt='logo' />
        </Box>
      </Link>
    </Box>
  )
}

export default Logo
