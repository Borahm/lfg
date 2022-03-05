import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Heading, Flex, Box, Text, Image } from '@chakra-ui/react'

const Home = () => {

  const [projects, setProjects] = useState([])
  const [hasError, setHasError] = useState({ error: false, message: '' })


  useEffect(() => {
    const getProjects = async () => {
      try {
        const { data } = await axios.get('/api/projects/')
        setProjects(data)
        console.log(data)
      } catch (err) {
        setHasError({ error: true, message: err.message })
      }
    }
    getProjects()
  }, [])

  return (
    <>
      {projects.length &&

        <Container>
          {projects.map(project => {
            const { id, title, hero_image, description, status, tldr, owner } = project
            return (
              <Flex key={id}>
                <Heading>{title}</Heading>
                <Text>{description}</Text>
              </Flex>
            )

          })}
        </Container>
      }

    </>


  )
}

export default Home
