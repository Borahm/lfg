
import { Buffer } from 'buffer';

// This function is simply to extract the token from the localStorage and return it
export const getTokenFromLocalStorage = () => {
  return window.localStorage.getItem('tinyhabits-token')
}

// This function is going to use the extracted token, and decode it to find the payload
// The payload is the section of the JWT that contains the subject and the expiry date
export const getPayload = () => {
  const token = getTokenFromLocalStorage() // uses getTokenFromLocalStorage to get token
  if (!token) return
  const splitToken = token.split('.')
  if (splitToken.length !== 3) return
  return JSON.parse(Buffer.from(splitToken[1], 'base64'))
}

export const userIsAuthenticated = () => {
  const payload = getPayload()
  if (!payload) return
  const currentTime = Math.round(Date.now() / 1000)
  return currentTime < payload.exp
}

export const userIsAuthenticatedProjectOwner = (project) => {
  const payload = getPayload()
  if (project.owner && payload) {
    if (project.owner.id === payload.sub) {
      console.log("You are the owner")
      return true
    }
  }
  // 
}

export const userSentRequest = (project) => {
  const payload = getPayload()
  console.log('payload ----->', payload)
  console.log('project ----->', project)

  if (payload && project.requests) {
    if (project.requests.some(member => member.owner.id === payload.sub)) {
      console.log("You are waiting for your request to be approved")
      return true
    } else {
      console.log("You should join")
      return false
    }
  }
}

export const userIsAuthenticatedOwnerOrMember = (project) => {
  const payload = getPayload()
  console.log('payload ----->', payload)
  console.log('project ----->', project)

  if (payload && project.owner && project.members) {
    if (project.owner.id === payload.sub) {
      console.log('You are the owner')
      return true
    } if (project.members.some(member => member.owner.id === payload.sub)) {
      console.log("You are a member")
      return true
    } else {
      console.log("You should join")
      return false
    }
  }
}

export const projectEmpty = (project) => {
  if (project.posts) {
    if (!project.posts.length) {
      console.log('is empty')
      return false
    } else return true
  }
}

export const requestEmpty = (project) => {
  if (project.requests) {
    if (!project.posts.length) {
      console.log('is empty')
      return false
    } else return true
  }
}

