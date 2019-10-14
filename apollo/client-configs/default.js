import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// Replace this with your project's endpoint
const baseURL = 'http://localhost:4000/'

export default () => ({
  link: new HttpLink({ 
    uri: baseURL,
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache(),
  defaultHttpLink: false,
})