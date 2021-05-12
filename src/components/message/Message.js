import './Message.css'
import { Avatar } from '@material-ui/core'

function Message() {
  return (
    <div className="message">
      <div className="message__left">
        <Avatar className="message__avatar" src="" alt="" />
      </div>
      <div className="message__right">
        <div className="message__details">
          <a href="/">Gospel Darlington</a>
          <small>12:45 PM</small>
        </div>
        <p className="message__text">
          Can I get the promotional link to my recent tutorial so I can start
          sharing?
        </p>
      </div>
    </div>
  )
}

export default Message
