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
              <Channel/>
            </Route>
            <Route path="/users/:id">
              <User/>
            </Route>
            <Route path="/">
              <h1>Welcome Screen</h1>
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  )
}

export default App
