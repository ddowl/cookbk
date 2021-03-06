import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
  // TODO: CHANGE THIS IN PRODUCTION TO 'same-origin',
  // IT'S A HUGE SECURITY VULNERABILITY
  // https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
  credentials: 'include',
});

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: httpLink,
  cache,
});

const data = {
  user: {
    __typename: 'User',
    isLoggedIn: false,
    id: null,
    email: null,
    recipes: []
  }
};
cache.writeData({ data });
client.onResetStore(async () => cache.writeData({ data }));

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
