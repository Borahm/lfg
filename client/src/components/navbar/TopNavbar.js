import React, { useEffect, useState } from 'react'
import { Link, Box, Text, Button, Stack, Flex, Avatar } from "@chakra-ui/react";
import { MenuToggle } from './MenuToggle'
import { useNavigate } from "react-router-dom"
import NavBarContainer from "./NavBarContainer"
import axios from 'axios'
import { getTokenFromLocalStorage, userIsAuthenticated } from '../helper/auth'



import Logo from "./Logo";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props} pt='4'>
      <Logo
        color={["white", "white", "primary.500", "primary.500"]}
      />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};



const MenuLinks = ({ isOpen }) => {

  const navigate = useNavigate()
  // const location = useLocation()
  // console.log(location)

  const [user, setUserData] = useState({})


  useEffect(() => {
    const getSingleUser = async () => {
      try {
        const res = await axios.get(`/api/auth/`,
          {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`,
            },
          }
        )
        setUserData(res.data)
        console.log('res data --->', res.data)
        console.log('user data --->', user.data)

      } catch (err) {
        setHasError({ error: true, message: err.message })
      }
    }
    getSingleUser()
    // joinProject()
  }, [])

  const handleLogout = (e) => {
    e.preventDefault()
    // Remove token
    window.localStorage.removeItem('tinyhabits-token')
    // Redirect to the home page
    navigate('/')
  }

  //  const [userProfileId, setUserProfileId] = useState('null')


  const redirectToRegister = () => {
    if (!userIsAuthenticated) navigate('/register')
  }



  return (
    <>
      <Box
        name="top"
        fontSize='14px'
        display={{ base: isOpen ? "flex" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
        justifyContent='flex-end'
      >
        <Stack
          spacing={8}
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["row", "row", "row", "row"]}
          pt={[4, 4, 0, 0]}
          alignItems='center'
        >
          <>
            {userIsAuthenticated() && user ?
              <Box name='subnav' w="100" display='flex' justifyContent='space-between'>
                <Flex name='user' key={user.id} mr='6'>
                  <Avatar size='xs' src={user.profile_picture} />
                  <Text ml='1' color='title'>{user.first_name}</Text>
                </Flex>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>

              </Box>
              :
              <>
                <MenuItem to="/login">Login</MenuItem>
                <MenuItem to="/register">Register</MenuItem>
                <MenuItem to='/create' isLast>
                  <Button
                    size="sm"
                    rounded="md"
                    color={["white", "white", "white", "white"]}
                    bg={["purple.500", "purple.500", "primary.500", "primary.500"]}
                    _hover={{
                      bg: ["primary.100", "primary.100", "primary.600", "primary.600"]
                    }}
                  >
                    Create project
                  </Button></MenuItem>
              </>
            }
          </>
        </Stack >
      </Box >
    </>
  )
}


export default NavBar;