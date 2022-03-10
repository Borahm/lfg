import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Container, Heading, Avatar, AvatarGroup, Badge, Button, Spinner, Image, Flex, Box, Text } from '@chakra-ui/react'
import { getTokenFromLocalStorage, userIsAuthenticated } from './helper/auth'


const Home = () => {

  const [projects, setProjects] = useState([])
  const [hasError, setHasError] = useState({ error: false, message: '' })


  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const { data } = await axios.get('/api/projects/')
        setProjects(data)
        console.log(data)
      } catch (err) {
        setHasError({ error: true, message: err.message })
      }
    }
    getAllProjects()
  }, [])

  return (
    <>
      <Flex flexDirection="column" alignItems="center" width='90%' mb='8' mt='12'>
        <Heading color='title' fontSize={['3xl', '4xl', '5xl']} textAlign="center">Looking for a group to <Heading fontSize={['3xl', '4xl', '5xl']} color='accent'>build awesome apps?</Heading> </Heading>
        <Text textAlign='center' color='text' width='60%' my='8'>LFG is a platform to find other General Assembly software engineers, UX designer, product managers and marketers.</Text>
        <Button as='a' p='4' colorScheme='purple' size='xl' href='/create'>Create a project</Button>
      </Flex>
      {
        projects.length ?
          <>
            <Container name='container' display='flex' flexDirection='column' maxW='container.lg' mt='' p='0'>
              <Flex name='project-container' alignItems='center' flexDirection='column' m='6'>
                {projects.sort(function (a, b) {
                  return new Date(b.created_at) - new Date(a.created_at)
                }).map(project => {
                  const { id, title, project_image, status, tldr, owner, members } = project
                  return (
                    <Link to={`/projects/${project.id}`} key={id}>
                      <Flex name='project-box' w={['19em', '30em', '50em']} flexDirection={['column', 'row', 'row']} borderWidth='1px' borderRadius='5' mb='5'>
                        <Flex maxWidth={['30vh', '20vh']}>
                          <Image src={project_image} mr='4' alt='project image' borderLeftRadius='5' objectFit='cover' />
                        </Flex>
                        <Flex name='box-content' m='6' flexDirection='column' justifyContent='center'>
                          <Heading name='project-name' color='title' fontSize={['1.2em', '1.2em', '1.6em']}>{title}</Heading>
                          <Box>
                            <Badge mt='3' colorScheme='purple'>{status}</Badge>
                          </Box>
                          <Box name='members' display='flex'>
                            <AvatarGroup>
                              {members &&
                                members.map(member => {
                                  const { id, owner } = member
                                  return (
                                    <Flex name='member-box' key={id}>
                                      <Avatar showBorder='true' size='md' my='4' src={owner.profile_picture} />
                                    </Flex>

                                  )
                                })
                              }
                            </AvatarGroup>
                          </Box>
                        </Flex>
                      </Flex>
                    </Link>
                  )
                })}
              </Flex>
            </Container>
          </>
          :
          <Spinner mt='4' />
      }

    </>


  )
}

export default Home
