import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { DrizzleProvider } from 'drizzle-react'


// Layouts
import "./index.css";
import App from './App'
import HomeContainer from './layouts/home/HomeContainer'
import LoadingContainer from './layouts/loading/LoadingContainer'
import 'bootstrap/dist/css/bootstrap.min.css';

// Contracts
import ThePrayerContract from './../build/contracts/ThePrayerContract.json'

// Redux Store
import store from './store'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);

// Set Drizzle options.
const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:9545'
    }
    , gas: 7000000
  },
  contracts: [
    ThePrayerContract
  ],
  events: {
    ThePrayerContract: ['PrayerAdded', 'PrayerAnswered', 'PrayerIncemented']
  }
};

ReactDOM.render((
    <DrizzleProvider options={options}>
      <Provider store={store}>
        <LoadingContainer>
          <Router history={history}>
            <Route path="/" component={App}>
              <IndexRoute component={HomeContainer} />
            </Route>
          </Router>
        </LoadingContainer>
      </Provider>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
