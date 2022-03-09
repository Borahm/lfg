import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
  AvatarGroup, Container, Heading, Avatar, Flex, Box, Badge, FormControl, FormLabel, Input, Button, Text, Textarea, Image, VStack, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { getTokenFromLocalStorage, userIsAuthenticated, userIsAuthenticatedProjectOwner, userIsAuthenticatedAndMember } from './helper/auth'


const Project = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef()
  const finalRef = React.useRef()

  const [project, setProject] = useState({})
  const [hasError, setHasError] = useState({ error: false, message: '' })
  const { projectId } = useParams()
  const [request, setRequest] = useState({
    text: '',
    project: '',
  })
  const [post, setPost] = useState({
    text: '',
    project: '',
    post_picture: '',
  })
  const [members, setMembers] = useState({
    project: '',
  })
  const [action, setAction] = useState(null)

  const [formError, setFormError] = useState('') // We expect only a string now

  useEffect(() => {
    const getSingleProject = async () => {
      try {
        const { data } = await axios.get(`/api/projects/${projectId}`,)
        setProject(data)
        console.log('data ---->', data)
      } catch (err) {
        setHasError({ error: true, message: err.message })
      }
    }
    getSingleProject()
  }, [request, members, projectId, action,])

  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    console.log('requests ---->', { ...request, project: parseInt(projectId) })
    try {
      await axios.post(`/api/requests/`, { ...request, project: parseInt(projectId) },
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
      setRequest({ text: '' })
      // handleChange('')
    } catch (err) {
      setHasError({ error: true, message: err.message })
    }
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault()
    console.log('post---->', { ...post, project: parseInt(projectId) })
    try {
      await axios.post(`/api/posts/`, { ...post, project: parseInt(projectId) },
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
      setPost({ text: '' })
      // handleChange('')
    } catch (err) {
      setHasError({ error: true, message: err.message })
    }
  }

  const handleAccept = async (e) => {
    e.preventDefault()

    try {

      await axios.post('/api/members/', { project: projectId },
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
      setRequest({ text: '' })
      await axios.delete(`/api/requests/${e.target.value}`,
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
      setRequest({ text: '' })

    } catch (err) {
      setHasError({ error: true, message: err.message })
    }
  }

  const handleRequestChange = (e) => {
    const newObj = { ...request, [e.target.name]: e.target.value } //Spreading request makes sure we maintain the data structure of request
    setRequest(newObj)
    setFormError('')
  }

  const handlePostChange = (e) => {
    const newObj = { ...post, [e.target.name]: e.target.value } //Spreading request makes sure we maintain the data structure of request
    setPost(newObj)
    setFormError('')
  }

  return (
    <Container width="60%" minWidth='60%' backgroundColor="white" borderRadius='8' mt='20' boxShadow='xl' p='10'>

      {project && project.owner &&
        <Flex name="header" flexDirection='column'>
          <Modal
            initialFocusRef={initialRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent p='2'>
              <ModalHeader>Send a request to join the group</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Flex name="request_form">
                  <form onSubmit={handleRequestSubmit}>
                    <FormControl isRequired>
                      <FormLabel htmlFor='text'>Tell us more about you</FormLabel>
                      <Textarea width="380px" onChange={handleRequestChange} type="text" name="text" placeholder='Text' value={request.text} />
                    </FormControl>
                    <Box mt='5'>
                      <Button mr='3' type="submit" colorScheme='purple' onClick={onClose}>Send request</Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </Box>
                  </form>
                </Flex>
              </ModalBody>

            </ModalContent>
          </Modal>
          <Box>

            <Flex p='8' name='project-box' mb='2' borderWidth='1px' borderRadius='8'>
              <Box display='flex' alignItems='center'>
                <Image src={project.project_image} ratio={1} alt='project image' borderRadius='8' />
              </Box>
              <Box name='box-content' ml='6' display='flex' flexDirection='column' justifyContent='center' >
                <Heading name='eventName' color='primary' size='lg'>{project.title}</Heading>
                <Box>
                  <Badge mt='3' colorScheme='purple'>{project.status}</Badge>
                </Box>
                <Text mt='4'>{project.tldr}</Text>
              </Box>
            </Flex>

            <Box name='request-box' px='8' py='6' mb='6' justifyContent='center' display='flex' colorScheme='purple' backgroundColor='gray.200' borderRadius='8'>
              <Box name='join-today' display='flex' alignItems='center'>
                <Heading size='md'>Let's build today</Heading>
                <Box name='members' display='flex' mx='6'  >
                  <AvatarGroup>
                    {project.project_members &&
                      project.project_members.map(member => {
                        const { id, owner } = member
                        return (
                          <Flex name='member-box' key={id}>
                            <Avatar showBorder='true' size='md' src={owner.profile_picture} />
                          </Flex>

                        )
                      })
                    }
                  </AvatarGroup>

                </Box>
                <Button onClick={onOpen} px='8' colorScheme='purple'>Join the project</Button>
              </Box>
            </Box>

          </Box>


          <Heading size='md' mb='4'>Description</Heading>
          <Text>{project.description}</Text>
        </Flex >
      }
      <Flex name="posts" flexDirection='column'>
        <Heading size='md' mb='4'>Description</Heading>

        {project.project_posts &&
          <Flex flexDirection='column'>
            {project.project_posts.map(post => {
              const { id, text, owner, post_picture } = post
              return (
                <Flex name='event-box' key={id} flexDirection="column">
                  <Text>{owner.first_name} {owner.last_name}</Text>
                  <Text>{text}</Text>
                  <Image src={post_picture} />
                </Flex>
              )
            })}
          </Flex>
        }
      </Flex>
      {
        userIsAuthenticatedProjectOwner(project) && project.owner &&
        <Flex name="requests" flexDirection='column'>
          <Heading size='md' mb='4'>Description</Heading>

          {project.project_requests &&
            <Flex flexDirection='column'>
              {project.project_requests.map(post => {
                const { id, text, owner } = post
                return (
                  <Flex name='event-box' key={id} flexDirection="column">
                    <Avatar src={owner.profile_picture} alt='owner' />
                    <Text>{owner.first_name} {owner.last_name}</Text>
                    <Text>{text}</Text>
                    <Button onClick={handleAccept} value={id} name={owner.id}>Accept</Button>
                  </Flex>
                )
              })}
            </Flex>
          }
        </Flex>
      }
      {
        userIsAuthenticatedAndMember(project) && project.project_members &&
        < Flex name="post_form">


          <Heading>Write Post</Heading>

          <form onSubmit={handlePostSubmit}>
            <FormControl isRequired>
              <FormLabel htmlFor='text'>Text</FormLabel>
              <Textarea onChange={handlePostChange} type="text" name="text" placeholder='text' value={post.text} />
            </FormControl>
            <Button type="submit">Write post</Button>
          </form>
        </Flex>
      }
      <Box
        width='100%'
        name='gradient'
        zIndex='-1'
        position='absolute'
        top='0'
        left='0'
        bgGradient='linear(to-b, transparent, white)'

        height='800px'>

      </Box>

      <Box
        width='120%'
        name='gradient'
        backgroundSize='100%'
        zIndex='-2'
        position='absolute'
        top='-20'
        left='-20'
        filter='auto'
        blur='50px'
        backgroundImage={project.project_image}
        backgroundRepeat="no-repeat"
        height='800px'>

      </Box>

    </Container >
  )

}

export default Project
