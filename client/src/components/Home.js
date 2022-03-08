import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Container, Heading, Avatar, Flex, Box, Text, Image } from '@chakra-ui/react'
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
      {projects.length &&

        <Container>
          <Flex flexDirection='column'>
            {projects.map(project => {
              const { id, title, project_image, status, tldr, owner } = project
              return (
                <Flex name='project-box' key={id} width='300px' height='320px' flexDirection='column' borderWidth='1px' alignItems='center' justifyContent='flex-start' boxShadow='2xl' borderRadius='10'>
                  <Image src={project_image} alt='hero image' />
                  <Link to={`/projects/${project.id}`}><Heading textAlign='center' name='eventName' color='primary' mt='0' size='lg'>{title}</Heading></Link>
                  <Avatar size='md' src={project.owner.profile_image} />
                  <Text>{owner.first_name} {owner.last_name}</Text>
                  <Text>{tldr}</Text>
                </Flex>
              )
            })}
          </Flex>
        </Container>
      }

    </>


  )
}

export default Home
