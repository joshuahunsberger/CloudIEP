import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Auth0Provider } from './react-auth0-spa';
import * as serviceWorker from './serviceWorker';
import history from './utils/history';

const onRedirectCallback = (result: any) => {
  const appState = result?.appState;
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

ReactDOM.render(
  <Auth0Provider
    onRedirectCallback={onRedirectCallback}
    initOptions={{
      domain: process.env.REACT_APP_AUTH0_DOMAIN ?? '',
      client_id: process.env.REACT_APP_AUTH0_CLIENTID ?? '',
      redirect_uri: 'http://localhost:3000',
      scope: 'openid',
      audience: 'https://cloudiepdev/api',
    }}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
