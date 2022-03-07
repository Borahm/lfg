import React, { useState } from 'react'
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Spinner
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Select } from '@chakra-ui/react'

// import { ImageUpload } from '../helper/ImageUpload'

const Register = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    course_location: '',
    course_number: '',
    password: '',
    password_confirmation: '',
  })

  const [formError, setFormError] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    course_location: '',
    course_number: '',
    password: '',
    password_confirmation: '',
  })
  const handleChange = (e) => {
    const newObj = { ...formData, [e.target.name]: e.target.valueAsNumber || e.target.value } //Spreading formData makes sure we maintain the data structure of formData
    setFormData(newObj)
    setFormError({ ...formError, [e.target.name]: '' })
    console.log(formData)
  }

  const [alert, setAlert] = useState(false)

  // Saves the token from handleSubmit in the localStorage
  // const [imageUploading, setImageUploading] = useState(false)


  const setTokenToLocalStorage = (token) => {
    window.localStorage.setItem('tinyhabits-token', token)
  }

  const handleSubmit = async (e) => {
    // if (formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation)
    //   setFormError({ ...formError, password_confirmation: 'passwords don\'t match' })
    e.preventDefault()
    if (formData) {
      try {
        console.log(formData)
        const { data } = await axios.post('api/auth/register/', formData) //Posting the data from the form
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

  // const handleImageUrl = url => {
  //   setFormData({ ...formData, profilePicture: url })
  // }

  return (
    <><Flex width="full" align="center" justifyContent="center" mt='10'>
      <Box background='white' p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="2xl">
        <>
          <Box textAlign="center">
            <Heading>Register</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit}>
              {/* FirstName */}
              <FormControl isRequired>
                <FormLabel htmlFor='firstName' mb='1'>First name</FormLabel>
                <Input onChange={handleChange} type="first_name" name="first_name" placeholder='First name' defaultValue={formData.first_name} />
                {formError.first_name && <Alert status='error' mt={4}>{formError.first_name}</Alert>}
              </FormControl>
              {/* last_name */}
              <FormControl isRequired>
                <FormLabel htmlFor='last_name' mb='1' mt={2}>last_name</FormLabel>
                <Input onChange={handleChange} type="last_name" name="last_name" placeholder='last_name' defaultValue={formData.last_name} />
                {formError.last_name && <Alert status='error' mt={4}>{formError.last_name}</Alert>}
              </FormControl>
              {/* Username */}
              <FormControl isRequired>
                <FormLabel htmlFor='username' mb='1' mt={2}>username</FormLabel>
                <Input onChange={handleChange} type="username" name="username" placeholder='username' defaultValue={formData.username} />
                {formError.username && <Alert status='error' mt={4}>{formError.username}</Alert>}
              </FormControl>
              {/* Course Number */}
              <FormControl isRequired>
                <FormLabel htmlFor='course_number' mb='1' mt={2}>course_number</FormLabel>
                <Input type='number' onChange={handleChange} placeholder='course_number' name="course_number" />



              </FormControl>
              {/* Course Location */}
              <FormControl isRequired>
                <FormLabel htmlFor='course_location' mb='1' mt={2}>course_location</FormLabel>
                <Select onChange={handleChange} placeholder='Course location' name="course_location">
                  <option value='REMOTE' name="course_location">Remote</option>
                  <option value='LONDON' name="course_location">London</option>
                  <option value='DENVER' name="course_location">Denver</option>
                </Select>
              </FormControl>
              {/* Email */}
              <FormControl isRequired>
                <FormLabel htmlFor='email' mt={2} mb='1'>Email</FormLabel>
                <Input onChange={handleChange} type="email" name="email" placeholder='Email' defaultValue={formData.email} />
                {formError.email && <Alert status='error' mt={4}>{formError.email}</Alert>}
              </FormControl>
              {/* Password */}
              <FormControl isRequired mt={2} mb='1'>
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
              {/*<FormControl isRequired mt={6}>
                <FormLabel htmlFor='picture'>Add Profile Picture</FormLabel>
               
                <ImageUpload
                  value={formData.profilePicture}
                  name='picture'
                  handleImageUrl={handleImageUrl}
                  setImageUploading={setImageUploading} />
              
              </FormControl> * /}
              {/* Error + Button */}
              {/*{!imageUploading ?
                <Button type="submit" colorScheme='blue' width="full" mt={4}>Register</Button>
                :
                <Spinner mt='4' />
              }
              {alert &&
                <Alert status='error'>
                  <AlertIcon />
                  Please upload a profile photo
                </Alert>

              }*/}
              <Button type="submit" colorScheme='blue' width="full" mt={4}>Register</Button>
            </form>
          </Box>
        </>
      </Box>
    </Flex>
    </>
  )
}

export default Register