import './App.css'
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'
// import

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app__body">
        <Sidebar />
        {/* React-router -> Chat Screen */}
      </main>
    </div>
  )
}

export default App
