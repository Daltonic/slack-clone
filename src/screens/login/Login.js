import './Login.css'
import { Button } from '@material-ui/core'

function Login() {
  return (
    <div className="login">
      <div className="login__container">
        <img
          src="http://assets.stickpng.com/images/5cb480cd5f1b6d3fbadece79.png"
          alt="Slack Logo"
        />

        <h4>Sign in to CometChat</h4>
        <p>cometchat.slack.com</p>
        <Button>Sign In With Google</Button>
      </div>
    </div>
  )
}

export default Login
