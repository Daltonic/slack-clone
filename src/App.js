import './App.css'
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'
import Channel from './screens/channel/Channel'
import Login from './screens/login/Login'
import User from './screens/user/User'
import Home from './screens/home/Home'
import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import db, { auth } from './firebase'
import { CometChat } from '@cometchat-pro/chat'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const [channel, setChannel] = useState('')
  const [privacy, setPrivacy] = useState('')

  const toggleClose = (e) => {
    e.preventDefault()
    const modal = document.getElementById('add-channel-popup')
    modal.setAttribute('class', 'overlay')
    resetForm()
  }

  const resetForm = () => {
    setChannel('')
    setChannel('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const user = JSON.parse(localStorage.getItem('user'))

    db.collection('/channels')
      .add({
        name: channel,
        privacy,
        uid: user.uid,
      })
      .then((c) => {
        const modal = document.getElementById('add-channel-popup')
        const details = {
          channel,
          privacy,
          guid: c.id,
        }

        modal.setAttribute('class', 'overlay')
        cometChatCreateGroup(details)
        resetForm()
      })
  }

  const cometChatCreateGroup = (data) => {
    const GUID = data.guid
    const groupName = data.channel
    const groupType =
    data.privacy
        ? CometChat.GROUP_TYPE.PUBLIC
        : CometChat.GROUP_TYPE.PRIVATE
    const password = ''

    const group = new CometChat.Group(GUID, groupName, groupType, password)

    CometChat.createGroup(group)
      .then((group) => console.log('Group created successfully:', group))
      .catch((error) => {
        console.log('Group creation failed with exception:', error)
      })
  }

  const addStructure = (Component, props) => {
    return (
      <>
        <Header />
        <main className="app__body">
          <Sidebar />
          <Component {...props} />
        </main>
      </>
    )
  }

  const GuardedRoute = ({ component: Component, auth, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        auth ? (
          addStructure(Component, props)
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  )

  useEffect(() => {
    const data = localStorage.getItem('user')
    if (data) {
      setIsLoggedIn(true)
    } else {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setIsLoggedIn(true)
        }
      })
    }
    setIsLoaded(true)
  }, [])

  if (!isLoaded) return null

  return (
    <div className="app">
      <Router>
        <Switch>
          <GuardedRoute
            path="/channels/:id"
            auth={isLoggedIn}
            component={Channel}
          />

          <GuardedRoute path="/users/:id" auth={isLoggedIn} component={User} />

          <Route path="/login">
            <Login />
          </Route>

          <GuardedRoute path="/" auth={isLoggedIn} component={Home} />
        </Switch>

        <div id="add-channel-popup" className="overlay">
          <div className="popup">
            <h2>Create a channel</h2>
            <a href="/" className="close" onClick={(e) => toggleClose(e)}>
              &times;
            </a>
            <div className="content">
              <form onSubmit={(e) => handleSubmit(e)} id="add-channel-form">
                <input
                  name="channel"
                  className="form-control"
                  type="text"
                  placeholder="Channel Name"
                  value={channel}
                  maxLength="20"
                  required
                  onChange={(e) => setChannel(e.target.value)}
                />

                <select
                  name="privacy"
                  className="form-control"
                  value={privacy}
                  required
                  onChange={(e) => setPrivacy(e.target.value === 'true')}
                >
                  <option value={''}>Select privacy</option>
                  <option value={false}>Public</option>
                  <option value={true}>Private</option>
                </select>

                <button className="form-btn">Create</button>
              </form>
            </div>
          </div>
        </div>
      </Router>
    </div>
  )
}

export default App
