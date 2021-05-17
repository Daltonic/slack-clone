import './App.css'
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'
import Channel from './screens/channel/Channel'
import Login from './screens/login/Login'
import User from './screens/user/User'
import { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import db from './firebase'
import { useStateValue } from './StateProvider'

function App() {
  const [form, setForm] = useState({})
  const [{ user }, dispatch] = useStateValue()

  const toggleClose = (e) => {
    e.preventDefault()
    const modal = document.getElementById('add-channel-popup')
    modal.setAttribute('class', 'overlay')
    setForm({})
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    db.collection('/channels')
      .add({
        name: form.channel,
        private: form.private === 'true',
      })
      .then(() => {
        const modal = document.getElementById('add-channel-popup')
        modal.setAttribute('class', 'overlay')
        setForm({})
      })
  }

  return (
    <div className="app">
      <Router>
        {!user ? (
          <Login />
        ) : (
          <>
            <Header />
            <main className="app__body">
              <Sidebar />
              <Switch>
                <Route path="/channels/:id">
                  <Channel />
                </Route>
                <Route path="/users/:id">
                  <User />
                </Route>
                <Route path="/">
                  <h1>Welcome Screen</h1>
                </Route>
              </Switch>
            </main>

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
                      value={form?.channel || ''}
                      maxLength="10"
                      required
                      onChange={(e) => handleChange(e)}
                    />

                    <select
                      name="private"
                      className="form-control"
                      value={form?.private || ''}
                      required
                      onChange={(e) => handleChange(e)}
                    >
                      <option value={''}>Select Privacy</option>
                      <option value={false}>Public</option>
                      <option value={true}>Private</option>
                    </select>

                    <button className="form-btn">Create</button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </Router>
    </div>
  )
}

export default App
