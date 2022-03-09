
import React from "react"
import { Flex } from "@chakra-ui/react";


const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      h="80px"
      py='4'
      px='10'
      borderWidth='1px'
      bg='white'
      color={["black", "black", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBarContainer