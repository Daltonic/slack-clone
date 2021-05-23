import './Home.css'
import { Button } from '@material-ui/core'

function Home() {
  const addChannel = () => {
    const modal = document.getElementById('add-channel-popup')
    modal.setAttribute('class', 'overlay overlay__show')
  }

  return (
    <div className="home">
      <div className="home__container">
        <img
          src="/logo.png"
          alt="Slack Logo"
        />
        <h1>Welcome to Slack</h1>
        <p>
          Slack brings all your team communication into one place, makes it all
          instantly searchable and available wherever you go.
        </p>

        <p>
          Our aim is to make your working life simpler, more pleasant and more
          productive.
        </p>

        <Button onClick={addChannel}>Create Channel</Button>
      </div>
    </div>
  )
}

export default Home
