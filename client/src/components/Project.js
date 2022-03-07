import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Heading, Flex, Box, FormControl, FormLabel, Button, Text, Textarea, Image, VStack } from '@chakra-ui/react'
import { getTokenFromLocalStorage, userIsAuthenticated } from './helper/auth'


const Project = () => {

  const [profile, setProfile] = useState({})
  const [project, setProject] = useState({})
  const [hasError, setHasError] = useState({ error: false, message: '' })
  const { projectId } = useParams()
  const [request, setRequest] = useState({
    text: '',
    project: projectId,
  })

  const [formError, setFormError] = useState('') // We expect only a string now

  const handleChange = (e) => {
    const newObj = { ...request, [e.target.name]: e.target.value } //Spreading request makes sure we maintain the data structure of request
    setRequest(newObj)
    setFormError('')
  }

  useEffect(() => {
    const getSingleProject = async () => {
      try {
        const { data } = await axios.get(`/api/projects/${projectId}`,)
        setProject(data)
        console.log(data)
      } catch (err) {
        setHasError({ error: true, message: err.message })
      }
    }
    getSingleProject()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('requests ---->', request)
    try {
      await axios.post('/api/requests/', request,
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
    } catch (err) {
      setHasError({ error: true, message: err.message })
    }

  }

  return (
    <Container>
      {project && project.owner &&
        <Flex name="header" flexDirection='column' mt='5'>
          <Heading>Title: {project.title}</Heading>
          <Text>TLR: {project.tldr}</Text>
          <Text>Owner: {project.owner.first_name} {project.owner.last_name}</Text>
          Members: {project.members &&
            project.members.map(member => {
              const { id, first_name, last_name } = member
              return (
                <Flex name='member-box' key={id}>
                  <Text>{first_name} {last_name}</Text>
                </Flex>
              )
            })
          }
          <Text>Description: {project.description}</Text>
          <Text>Hero Image:{project.hero_image}</Text>
          <Text>Project Images:{project.project_images}</Text>
        </Flex>
      }
      <Flex name="posts">
        <Heading>Posts</Heading>
        {project.written_posts &&
          <Flex flexDirection='column'>
            {project.written_posts.map(post => {
              const { id, text, owner } = post
              return (
                <Flex name='event-box' key={id} flexDirection="column">
                  <Text>{owner.first_name} {owner.last_name}</Text>
                  <Text>{text}</Text>
                </Flex>
              )
            })}
          </Flex>
        }
      </Flex>

      <Flex name="requests">
        <Heading>Requests</Heading>
        {project.project_requests &&
          <Flex flexDirection='column'>
            {project.project_requests.map(post => {
              const { id, text, owner } = post
              return (
                <Flex name='event-box' key={id} flexDirection="column">
                  <Image src={owner.profile_image} alt='owner' />
                  <Text>{owner.first_name} {owner.last_name}</Text>
                  <Text>{text}</Text>
                </Flex>
              )
            })}
          </Flex>
        }
      </Flex>

      <Flex name="request_form">
        <Heading>Send Request</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel htmlFor='text'>Text</FormLabel>
            <Textarea onChange={handleChange} type="text" name="text" placeholder='text' defaultValue={request.text} />
          </FormControl>
          <Button onClick={handleSubmit}>Send request</Button>
        </form>
      </Flex>
    </Container >
  )

}

export default Project
