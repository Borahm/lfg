import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Heading, Flex, Box, Text, Image } from '@chakra-ui/react'

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
              const { id, title, hero_image, status, tldr, owner } = project
              return (
                <Flex name='event-box' key={id} flexDirection="column">
                  <Heading>{title}</Heading>
                  <Image src={hero_image} alt='hero image' />
                  <Image src={owner.profile_iamge} alt='owner' />
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
