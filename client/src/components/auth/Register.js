import React, { useState } from 'react'
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Image,
  Input,
  Link,
  Text,
  Button,
  Alert,
  AlertIcon,
  Spinner
} from '@chakra-ui/react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import { Select } from '@chakra-ui/react'
import { ImageUpload } from '../helper/ImageUpload'

const Register = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile: '',
    course_location: '',
    course_number: '',
    password: '',
    password_confirmation: '',
    profile_picture: '',

  })

  const [formError, setFormError] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile: '',
    course_location: '',
    course_number: '',
    password: '',
    password_confirmation: '',
    profile_picture: '',

  })
  const handleChange = (e) => {
    const newObj = { ...formData, [e.target.name]: e.target.valueAsNumber || e.target.value } //Spreading formData makes sure we maintain the data structure of formData
    setFormData(newObj)
    setFormError({ ...formError, [e.target.name]: '' })
    console.log(formData)
  }

  const [alert, setAlert] = useState(false)

  // Saves the token from handleSubmit in the localStorage
  const [imageUploading, setImageUploading] = useState(false)


  const setTokenToLocalStorage = (token) => {
    window.localStorage.setItem('tinyhabits-token', token)
  }

  const handleSubmit = async (e) => {
    // if (formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation)
    //   setFormError({ ...formError, password_confirmation: 'passwords don\'t match' })
    e.preventDefault()
    if (formData.profile_picture) {
      try {
        console.log(formData)
        const { data } = await axios.post('/api/auth/register/', formData) //Posting the data from the form
        console.log('token -->', data.token)
        setTokenToLocalStorage(data.token) // pass on the token to the localStorage
        navigate('/')
      } catch (err) {
        const arr = Object.keys(err.response.data.errors)
        const key = (arr[0])
        setFormError({ [key]: err.response.data.message })
      }
    } else setAlert(true)
    setTimeout(() => {
      setAlert(false)
    }, 2000)
  }

  const handleImageUrl = url => {
    setFormData({ ...formData, profile_picture: url })
  }

  return (
    <><Flex align="center" justifyContent="center" mt='20'>
      <Box background='white' p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="2xl">
        <>
          <Box textAlign="center">
            <Heading size='lg' mt='5'>Register</Heading>
            <Flex justifyContent="center" mt='2'>
              <Text color='text' mr='2'>Already a user?</Text><Link color="accent" as={RouterLink} to='/login'>Login now</Link>
            </Flex>
          </Box>
          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit}>
              {/* FirstName */}
              <Flex>
                <FormControl isRequired mr='4'>
                  <FormLabel htmlFor='firstName' mb='1'>First name</FormLabel>
                  <Input onChange={handleChange} type="first_name" name="first_name" placeholder='First name' defaultValue={formData.first_name} />
                  {formError.first_name && <Alert status='error' mt={4}>{formError.first_name}</Alert>}
                </FormControl>
                {/* last_name */}
                <FormControl isRequired>
                  <FormLabel htmlFor='last_name' mb='1'>Last name</FormLabel>
                  <Input onChange={handleChange} type="last_name" name="last_name" placeholder='last_name' defaultValue={formData.last_name} />
                  {formError.last_name && <Alert status='error' mt={4}>{formError.last_name}</Alert>}
                </FormControl>
              </Flex>
              {/* Profile */}
              <FormControl isRequired mt='2'>
                <FormLabel htmlFor='profile' mb='1' mt={2}>Profile</FormLabel>
                <Select onChange={handleChange} placeholder='Profile' name="profile">
                  <option value='Engineer' name="profile">Software Engineer</option>
                  <option value='Designer' name="profile">Designer</option>
                  <option value='Product' name="profile">Product Manager</option>
                  <option value='Other' name="profile">Other</option>
                </Select>
              </FormControl>
              <Flex mt='2'>
                {/* Course Location */}
                <FormControl isRequired mr='4'>
                  <FormLabel htmlFor='course_location' mb='1' mt={2}>Course_location</FormLabel>
                  <Select onChange={handleChange} placeholder='Course location' name="course_location">
                    <option value='Remote' name="course_location">Remote</option>
                    <option value='London' name="course_location">London</option>
                    <option value='Denver' name="course_location">Denver</option>
                  </Select>
                </FormControl>
                {/* Course Number */}
                <FormControl isRequired>
                  <FormLabel htmlFor='course_number' mb='1' mt={2}>Course number</FormLabel>
                  <Input type='number' onChange={handleChange} placeholder='61' name="course_number" />
                </FormControl>

              </Flex>
              {/* Email */}
              <FormControl isRequired mt='2'>
                <FormLabel htmlFor='email' mt={2} mb='1'>Email</FormLabel>
                <Input onChange={handleChange} type="email" name="email" placeholder='Email' defaultValue={formData.email} />
                {formError.email && <Alert status='error' mt={4}>{formError.email}</Alert>}
              </FormControl>
              <Flex>
                {/* Password */}
                <FormControl isRequired mt={2} mb='1' mr='4'>
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <Input onChange={handleChange} type="password" name="password" placeholder='Password' defaultValue={formData.password} />
                  {formError.password && <Alert status='error' mt={4}>{formError.password}</Alert>}
                </FormControl>
                {/* Password Confirmation */}
                <FormControl isRequired mt={2}>
                  <FormLabel htmlFor='password_confirmation'>Password Confirmation</FormLabel>
                  <Input onChange={handleChange} type="password" name="password_confirmation" placeholder='Password Confirmation' defaultValue={formData.password_confirmation} />
                  {formError.password_confirmation && <Alert status='error' mt={4}>{formError.password_confirmation}</Alert>}
                </FormControl>
              </Flex>
              <FormControl isRequired mt={2}>
                <FormLabel htmlFor='picture'>Add Profile Picture</FormLabel>

                <ImageUpload
                  value={formData.profile_picture}
                  name='picture'
                  handleImageUrl={handleImageUrl}
                  setImageUploading={setImageUploading} />

              </FormControl>
              {/* Error + Button */}
              {!imageUploading ?
                <Button type="submit" colorScheme='purple' width="full" mt={4}>Register</Button>
                :
                <Spinner mt='2' />
              }
              {alert &&
                <Alert status='error'>
                  <AlertIcon />
                  Please upload a profile photo
                </Alert>

              }
            </form>
          </Box>
        </>
      </Box>
      <Box width='100%' height='100vh' zIndex='-1' position='absolute' top='0' left='0' opacity='100%' bgGradient='radial( accent, white)' >
      </Box>
    </Flex>
    </>
  )
}

export default Register