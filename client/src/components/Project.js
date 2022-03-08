import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Heading, Avatar, Flex, Box, FormControl, FormLabel, Button, Text, Textarea, Image, VStack } from '@chakra-ui/react'
import { getTokenFromLocalStorage, userIsAuthenticated, userIsAuthenticatedProjectOwner, userIsAuthenticatedAndMember } from './helper/auth'


const Project = () => {

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
    < Container >

      {project && project.owner &&
        <Flex name="header" flexDirection='column' mt='5'>
          <Heading>Title: {project.title}</Heading>
          <Text>STATUS: {project.status}</Text>
          <Text>TDLR: {project.tldr}</Text>
          <Avatar size='md' src={project.owner.profile_image} />
          <Text>Owner: {project.owner.first_name} {project.owner.last_name}</Text>
          Members: {project.project_members &&
            project.project_members.map(member => {
              const { id, owner } = member
              return (
                <Flex name='member-box' key={id}>
                  <Text>{owner.first_name} {owner.last_name}</Text>
                </Flex>
              )
            })
          }
          <Text>Description: {project.description}</Text>
          <Image src={project.project_image} />
        </Flex>
      }
      <Flex name="posts">
        <Heading>Posts</Heading>
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
      {userIsAuthenticatedProjectOwner(project) && project.owner &&
        < Flex name="requests">
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
                    <Button onClick={handleAccept} value={id} name={owner.id}>Accept</Button>
                  </Flex>
                )
              })}
            </Flex>
          }
        </Flex>
      }
      {userIsAuthenticatedAndMember(project) && project.project_members &&
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
      <Flex name="request_form">
        <Heading>Send Request</Heading>
        <form onSubmit={handleRequestSubmit}>
          <FormControl isRequired>
            <FormLabel htmlFor='text'>Text</FormLabel>
            <Textarea onChange={handleRequestChange} type="text" name="text" placeholder='text' value={request.text} />
          </FormControl>
          <Button type="submit">Send request</Button>
        </form>
      </Flex>

    </Container >
  )

}

export default Project
