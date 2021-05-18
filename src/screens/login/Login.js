import './Login.css'
import { Button } from '@material-ui/core'
import { auth, provider } from '../../firebase'
import { useHistory } from 'react-router-dom'

function Login() {
  const history = useHistory()

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.user))
        setTimeout(() => history.push('/'), 2000)
      })
      .catch((error) => alert(error.message))
  }

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="http://assets.stickpng.com/images/5cb480cd5f1b6d3fbadece79.png"
          alt="Slack Logo"
        />

        <h4>Sign in to CometChat</h4>
        <p>cometchat.slack.com</p>
        <Button onClick={signIn}>Sign In With Google</Button>
      </div>
    </div>
  )
}

export default Login
