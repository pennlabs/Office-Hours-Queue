import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'semantic-ui-css/semantic.min.css';
import { ApolloProvider } from '@apollo/react-hooks';

import firebase from './components/Firebase'
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

const project = process.env.REACT_APP_GCLOUD_PROJECT;
const backendUri =
  project === 'office-hour-q' ? 'https://api.ohq.io/graphql' :
  project === 'office-hour-q-stg' ? 'https://api.stg.ohq.io/graphql' : undefined;

const httpLink = createHttpLink({
  uri: backendUri,
});

const authLink = setContext(async (_, { headers }) => {
  const token = firebase.auth.currentUser ? await firebase.auth.currentUser.getIdToken() : null;
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root')
);