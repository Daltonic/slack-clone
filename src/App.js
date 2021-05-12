import './App.css'
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'
import Channel from './screens/channel/Channel'
import User from './screens/user/User'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <Router>
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

        <div id="popup1" className="overlay">
          <div className="popup">
            <h2>Here i am</h2>
            <a className="close" href="/">
              &times;
            </a>
            <div className="content">
              Thank to pop me out of that button, but now i'm done so you can
              close this window.
            </div>
          </div>
        </div>
      </Router>
    </div>
  )
}

export default App
