import './CallScreen.css'
import { Button } from '@material-ui/core'
import CallIcon from '@material-ui/icons/Call'
import CallEndIcon from '@material-ui/icons/CallEnd'

function CallScreen({ name, avatar, call }) {
  return (
    <div className="callScreen">
      <div className="callScreen__container">
        <div className="call-animation">
          <img
            className="img-circle"
            src="https://placeimg.com/400/400/people"
            alt=""
            width="135"
          />
        </div>
        <h4>Nancy Calling</h4>

        <div className="callScreen__btns">
          <Button>
            <CallIcon />
          </Button>
          <Button>
            <CallEndIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CallScreen
