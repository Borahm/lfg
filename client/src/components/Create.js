import React, { useState, useEffect } from 'react'
import {
  Flex,
  Box,
  Heading,
  Select,
  FormControl,
  Image,
  FormLabel,
  Input,
  Button,
  Text,
  Alert,
  Textarea,
  AlertIcon,
  Spinner
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getTokenFromLocalStorage, userIsAuthenticated } from './helper/auth'
import { ImageUpload } from '../components/helper/ImageUpload'



const Create = () => {

  const navigate = useNavigate()

  const [alert, setAlert] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    tldr: '',
    description: '',
    status: '',
    project_image: '',
  })

  const [formError, setFormError] = useState({
    title: '',
    tldr: '',
    description: '',
    status: '',
    project_image: '',

  })
  const handleChange = (e) => {
    const newObj = { ...formData, [e.target.name]: e.target.valueAsNumber || e.target.value } //Spreading formData makes sure we maintain the data structure of formData
    setFormData(newObj)
    setFormError({ ...formError, [e.target.name]: '' })
    console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.project_image) {
      try {
        console.log(formData)
        const { data } = await axios.post('/api/projects/', formData,
          {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`,
            },
          })

        setFormData(data)
        console.log('data -->', data)
        if (data) {
          await axios.post('/api/members/', { project: data.id, owner: data.owner },
            {
              headers: {
                Authorization: `Bearer ${getTokenFromLocalStorage()}`,
              },
            })
        }
        navigate(`/projects/${data.id}`)
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
    setFormData({ ...formData, project_image: url })
  }

  useEffect(() => {
    const redirectToRegister = () => {
      if (!userIsAuthenticated()) {
        navigate('/register')
      }
    }
    redirectToRegister()
  }, [])


  return (

    <>
      <Flex width="full" align="center" justifyContent="center" mt='10'>
        <Box background='white' p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="2xl">
          <>
            <Box textAlign="center" p='8'>
              <Flex flexDirection="column" alignItems='center' p='1'>
                <Box width='140px' display='flex'>
                  <Image src='https://res.cloudinary.com/dxd82e0ky/image/upload/v1646922268/lfg/Group_v4lne9.png' alt='logo' />
                </Box>
                <Heading size='lg' mt='8'>Create project</Heading>
                <Text mt='2' color='text'>Find other developers and designer to collaborate </Text>
              </Flex>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={handleSubmit}>
                {/* title */}
                <FormControl isRequired>
                  <FormLabel htmlFor='title' mb='1'>Project title</FormLabel>
                  <Input onChange={handleChange} type="title" name="title" placeholder='Title' defaultValue={formData.title} />
                  {formError.title && <Alert status='error' mt={4}>{formError.title}</Alert>}
                </FormControl>
                {/* tldr */}
                <FormControl isRequired>
                  <FormLabel htmlFor='tldr' mb='1' mt={2}>tldr</FormLabel>
                  <Input onChange={handleChange} type="tldr" name="tldr" placeholder='tldr' defaultValue={formData.tldr} />
                  {formError.tldr && <Alert status='error' mt={4}>{formError.tldr}</Alert>}
                </FormControl>
                {/* description */}
                <FormControl isRequired>
                  <FormLabel htmlFor='description' mb='1' mt={2}>Project description</FormLabel>
                  <Textarea onChange={handleChange} type="description" name="description" placeholder='description' defaultValue={formData.description} />
                  {formError.description && <Alert status='error' mt={4}>{formError.description}</Alert>}
                </FormControl>
                {/* status */}
                <FormControl isRequired>
                  <FormLabel htmlFor='status' mb='1' mt={2}>Project status</FormLabel>
                  <Select onChange={handleChange} placeholder='status' name="status">
                    <option value='IDEATING' name="status">Ideating</option>
                    <option value='EXPLORING' name="status">Exploring</option>
                    <option value='BUILDING' name="status">Building</option>
                  </Select>
                </FormControl>
                <FormControl isRequired mt={6}>
                  <FormLabel htmlFor='project_image'>Add a project image</FormLabel>

                  <ImageUpload
                    value={formData.project_image}
                    name='project_image'
                    handleImageUrl={handleImageUrl}
                    setImageUploading={setImageUploading} />

                </FormControl>
                {/* Error + Button */}
                {!imageUploading ?
                  <Button type="submit" colorScheme='purple' width="full" mt={4}>Create a new project</Button>
                  :
                  <Spinner mt='4' />
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

export default Create