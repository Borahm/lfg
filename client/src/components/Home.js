import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Container, Heading, Avatar, AvatarGroup, Badge, Flex, Box, Text, Image } from '@chakra-ui/react'
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
      <Heading color='purple.500' my='4' p='10' fontSize='4xl' width='80%' textAlign="center">Find other GA developers, designer and products graduates to build awesome apps </Heading>
      {
        projects.length &&
        <Container name='container' display='flex' flexDirection='column' maxW='container.lg' mt='' p='0'>
          <Flex name='project-container' alignItems='center' flexDirection='column' mt='4' mb='4'>
            {projects.map(project => {
              const { id, title, project_image, status, tldr, owner, project_members } = project
              return (
                <Link to={`/projects/${project.id}`} key={id}>
                  <Flex name='project-box' w={['400px', '500px', '700px']} height='150px' borderWidth='1px' borderRadius='5' mb='5'>
                    <Image src={project_image} alt='project image' borderLeftRadius='5' height='150px' />
                    <Box name='box-content' m='6'>
                      <Heading name='eventName' color='primary' size='md'>{title}</Heading>
                      <Badge mt='3' colorScheme='purple'>{status}</Badge>
                      <Box name='members' display='flex'>
                        <AvatarGroup>
                          {project_members &&
                            project_members.map(member => {
                              const { id, owner } = member
                              return (
                                <Flex name='member-box' key={id}>
                                  <Avatar showBorder='true' size='sm' my='4' src={owner.profile_picture} />
                                </Flex>

                              )
                            })
                          }
                        </AvatarGroup>
                      </Box>
                    </Box>
                  </Flex>
                </Link>
              )
            })}
          </Flex>
        </Container>
      }

    </>


  )
}

export default Home
