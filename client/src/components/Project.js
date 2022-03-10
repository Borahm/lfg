import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
  AvatarGroup, Container, Heading, Avatar, Flex, Box, Badge, FormControl, FormLabel, Input, Button, Text, Textarea, Image, VStack, Modal,
  ModalOverlay,
  Spinner,
  ModalContent,
  ModalHeader,
  ModalBody,
  AlertIcon,
  Alert,
  ModalCloseButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { getTokenFromLocalStorage, userIsAuthenticated, projectEmpty, requestEmpty, userIsAuthenticatedProjectOwner, userIsAuthenticatedOwnerOrMember, userSentRequest } from './helper/auth'
import { ImageUpload } from '../components/helper/ImageUpload'


const Project = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const positions = [
    'top',
    'top-right',
    'top-left',
    'bottom',
    'bottom-right',
    'bottom-left',
  ]

  const initialRef = React.useRef()
  const finalRef = React.useRef()
  const [alert, setAlert] = useState(false)

  const [user, setUserData] = useState({})
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
  const statuses = ['success', 'error', 'warning', 'info']

  const [imageUploading, setImageUploading] = useState(false)


  const [formError, setFormError] = useState('') // We expect only a string now

  useEffect(() => {
    const getSingleProject = async () => {
      try {
        const { data } = await axios.get(`/api/projects/${projectId}`,)
        setProject(data)
        console.log('project data ---->', data)
      } catch (err) {
        setHasError({ error: true, message: err.message })
      }
    }
    getSingleProject()
  }, [request, post, members, projectId, action])


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
      } catch (err) {
        setHasError({ error: true, message: err.message })
      }
    }
    getSingleUser()
    // joinProject()
  }, [])

  const toastExample = (e) => {
    toast({
      title: 'Success!',
      duration: 9000,
      isClosable: true,
      status: 'info',
      position: 'top',
      colorScheme: 'purple'
    })
  }


  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    console.log('requests ---->', { ...request, project: parseInt(projectId) })
    try {
      const { data } = await axios.post(`/api/requests/`, { ...request, project: parseInt(projectId) },
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
      console.log('data ----->', data)
      setRequest(data)
      toastExample()
      // handleChange('')
    } catch (err) {
      setHasError({ error: true, message: err.message })
    }
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault()
    console.log('post---->', { ...post, project: parseInt(projectId) })
    try {
      const { data } = await axios.post(`/api/posts/`, { ...post, project: parseInt(projectId) },
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
      toastExample()
      setPost({ text: '' })
      // handleChange('')
    } catch (err) {
      setHasError({ error: true, message: err.message })
    }
  }

  const handleAccept = async (e) => {
    e.preventDefault()
    console.log('etarget name--->', e.target.name, 'etarget value -->', e.target.value, 'etarget request -->', e.target.attributes.getNamedItem('requestId').value)
    try {

      await axios.post('/api/members/', { project: projectId, owner: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
      setRequest({ text: '' })
      await axios.delete(`/api/requests/${e.target.attributes.getNamedItem('requestId').value}`,
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
      setRequest({ text: '' })
      toastExample()
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

  const handleImageUrl = url => {
    setPost({ ...post, post_picture: url })
  }

  return (

    <Flex name='project-container' flexDirection='column' width="65%" minWidth='65%' maxW='container.lg' backgroundColor="white" borderRadius='8' mt='20' mb='20' boxShadow='xl'>
      <>
        <Flex name='project-header' borderRadius='8' backgroundColor='background' flexDirection={['column', 'column', 'row']} >
          <Flex name='project-image' maxWidth={['100vw', '100vw', '25vw']}>
            <Image src={project.project_image} objectFit='cover' alt='project image' borderTopLeftRadius='8' />
          </Flex>
          <Flex name='project-content' p='10' display='flex' flexDirection='column' justifyContent='center' >
            <Heading name='eventName' color='title' fontSize={['1.4em', '2em', '2.2em']}> {project.title}</Heading>
            <Box>
              <Badge mt='3' colorScheme='purple'>{project.status}</Badge>
            </Box>
            <Text mt='4'>{project.tldr}</Text>
            <Box name='members' display='flex'>
              <AvatarGroup display='flex' flexWrap='wrap' spacing='4'>
                {project.members &&
                  project.members.map(member => {
                    const { id, owner } = member
                    return (
                      <Flex name='member-box' key={id} mt='6'>
                        <Avatar showBorder='true' size='md' src={owner.profile_picture} />
                        <Flex flexDirection='column' justifyContent='center' ml='2'>
                          <Text fontSize='sm'>{owner.first_name} {owner.last_name}</Text>
                          <Text fontSize='sm' color='text'>{owner.profile}</Text>
                        </Flex>
                      </Flex>

                    )
                  })
                }
              </AvatarGroup>
            </Box>
          </Flex>
        </Flex>


        <Flex flexDirection='column' name='content-container' p='10' width='100%'>
          {project ?

            <>
              <Flex name='request-box' px='8' py='6' mb='4' justifyContent='center' display='flex' colorScheme='purple' backgroundColor='background' borderRadius='8'>
                <Box name='join-today' display='flex' alignItems='center'>
                  <>
                    {!userIsAuthenticated() ?
                      <>
                        <Heading size='md' mx='6'>Let's build today</Heading>
                        <Button colorScheme='purple'>Sign up</Button>
                      </>
                      :
                      <>
                        {!userSentRequest(project) ?
                          <>
                            {(userIsAuthenticated() && userIsAuthenticatedOwnerOrMember(project) && project.members) ?
                              <Heading size='md' mx='6'>Post an update!</Heading>
                              :
                              <>
                                <Heading size='md' mx='6'>Let's build today</Heading>
                                <Button onClick={onOpen} px='8' colorScheme='purple' name="Request submitted" value="Do more">Join the project</Button>
                              </>
                            }
                          </>
                          :
                          <Heading size='md' mx='6'>Waiting for your Request to be approved</Heading>
                        }
                      </>
                    }
                  </>
                </Box>
              </Flex>
              {project && project.owner &&
                <Flex name="header" flexDirection='column'>
                  <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}
                  >
                    <ModalOverlay />
                    <ModalContent p='2'>
                      <ModalHeader>Send a request to join the group</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <Flex toastTitle='Request submited' toastDescription='`You should hear back soon from ${project.owner.first_name}`' name="request_form">
                          <form onSubmit={handleRequestSubmit}>
                            <FormControl isRequired>
                              <FormLabel htmlFor='text'>Tell us more about you</FormLabel>
                              <Textarea width="380px" onChange={handleRequestChange} type="text" name="text" placeholder='Text' value={request.text} />
                            </FormControl>
                            <Box mt='5'>
                              <Button mr='3' type="submit" colorScheme='purple' backgrooun onClick={onClose} >Send request</Button>
                              <Button onClick={onClose}>Cancel</Button>
                            </Box>
                          </form>
                        </Flex>
                      </ModalBody>

                    </ModalContent>
                  </Modal>


                  {userIsAuthenticated() && userIsAuthenticatedProjectOwner(project) && project.owner && project.requests &&
                    <Flex name="requests" mt='4' flexDirection='column'>
                      {!requestEmpty(project) &&
                        <Heading size='md' mb='4'>Requests</Heading>}
                      {project.requests &&
                        <Flex flexWrap='wrap'>
                          {project.requests.map(request => {
                            const { id, text, owner } = request
                            return (
                              <Flex p='4' mb='4' name='event-box' justifyContent='space-between' width='100%' key={id} alignItems='center' backgroundColor='background' borderRadius='8'>
                                <Flex alignItems='center'>
                                  <Avatar size='sm' src={owner.profile_picture} alt='owner' />
                                  <Flex ml='4' flexDirection='column'>
                                    <Text fontSize='12px' fontweight='bold' >{owner.first_name} {owner.last_name}</Text>
                                    <Text>"{text}"</Text>
                                  </Flex>
                                </Flex>
                                <Box>
                                  <Button onClick={handleAccept} value={owner.id} name='owner' colorScheme='purple' requestId={id}>Accept</Button>
                                </Box>
                              </Flex>
                            )
                          })}
                        </Flex>
                      }
                    </Flex>
                  }

                  <Heading size='md' my='4'>Description</Heading>
                  <Text color='text'>{project.description}</Text>
                </Flex>
              }

              {userIsAuthenticated() && userIsAuthenticatedOwnerOrMember(project) && project.members && project.owner &&
                <Flex name="post_form" width='100%'>
                  <Flex name="posts" mt='4' flexDirection='column' width='100%'>
                    <Heading size='md' mb='4'>Project updates</Heading>
                    <Flex name='post-box' width='100%' flexDirection='column'>
                      <form onSubmit={handlePostSubmit}>
                        <FormControl isRequired>
                          <Textarea onChange={handlePostChange} type="text" name="text" placeholder='text' value={post.text} />
                        </FormControl>
                        <FormControl isRequired mt={6}>
                          <FormLabel htmlFor='post_picture'>Add a picture to your post</FormLabel>
                          <ImageUpload
                            value={post.post_picture}
                            name='post_picture'
                            handleImageUrl={handleImageUrl}
                            setImageUploading={setImageUploading} />
                        </FormControl>
                        {/* Error + Button */}
                        {!imageUploading ?
                          <Button type="submit" colorScheme='purple' width="full" mt={4} name="Posted" value="Do more">Post</Button>
                          :
                          <Spinner mt='4' />
                        }
                        {alert &&
                          <Alert status='error'>
                            <AlertIcon />
                            Please upload a picture
                          </Alert>
                        }
                      </form>
                    </Flex>
                  </Flex>
                </Flex>
              }

              {projectEmpty(project) && project.posts ?
                <>
                  {console.log('project posts ---->', project.posts.length)}
                  <Heading size='md' mb='4' mt='8'>Last posts</Heading>
                  <Flex mt='4' flexDirection='column'>
                    {project.posts.sort(function (a, b) {
                      return new Date(b.created_at) - new Date(a.created_at)
                    }).map(post => {
                      const { id, text, owner, post_picture } = post
                      return (
                        <Flex p='4' mb='4' name='post-box' width='100%' key={id} alignItems='center' backgroundColor='background' borderWidth='1px' borderRadius='8'>
                          <Flex>
                            <Flex alignItems='flex-start'>
                              <Avatar size='sm' src={owner.profile_picture} alt='owner' />
                            </Flex>
                            <Flex ml='4' flexDirection='column'>
                              <Text pt='1' fontSize='16px' fontweight='bold' >{owner.first_name} {owner.last_name}</Text>
                              <Text my='4'>{text}</Text>
                              <Image src={post_picture}></Image>
                            </Flex>
                          </Flex>
                        </Flex>
                      )
                    })}
                  </Flex>
                </>
                :
                <></>
              }
              <Box
                width='100%'
                name='gradient'
                zIndex='-1'
                position='absolute'
                top='0'
                left='0'
                bgGradient='linear(to-b, transparent, white)'

                height='850px'>

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
            </>
            :
            <Spinner />

          }
        </Flex>
      </>
    </Flex >

  )

}

export default Project
