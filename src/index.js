import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { CometChat } from '@cometchat-pro/chat'
import { cometChat } from './app.config'

const appID = cometChat.APP_ID
const region = cometChat.APP_REGION
const appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .build()

CometChat.init(appID, appSetting)
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    )
    console.log('Initialization completed successfully')
  })
  .catch((error) => {
    console.log('Initialization failed with error:', error)
  })

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
