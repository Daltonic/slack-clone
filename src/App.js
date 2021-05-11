import './App.css'
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'
import Chat from './screens/chat/Chat'
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
              <Chat/>
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
