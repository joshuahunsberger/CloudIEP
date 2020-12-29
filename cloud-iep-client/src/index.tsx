import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { AppState, Auth0Provider } from '@auth0/auth0-react';
import * as serviceWorker from './serviceWorker';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

// Example from documentation:
// https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#1-protecting-a-route-in-a-react-router-dom-app
const onRedirectCallback = (appState: AppState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN ?? ''}
    clientId={process.env.REACT_APP_AUTH0_CLIENTID ?? ''}
    redirectUri="http://localhost:3000/logincallback"
    scope="openid"
    audience="https://cloudiepdev/api"
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
