
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
    if (payload.sub != project.owner.id) return
  }
  // 
  if (!payload) return
  const currentTime = Math.round(Date.now() / 1000)
  return currentTime < payload.exp
}

export const userIsAuthenticatedAndMember = (project) => {
  const payload = getPayload()
  if (project.project_members && payload) {
    console.log('find member', project.project_members.some(member => member == payload.sub))
    if (payload.sub != project.owner.id) return
  }
  // 
  if (!payload) return
  const currentTime = Math.round(Date.now() / 1000)
  return currentTime < payload.exp
}