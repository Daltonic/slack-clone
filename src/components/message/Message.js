import './Message.css'
import { Avatar } from '@material-ui/core'

function Message({ uid, name, avatar, message, timestamp }) {
  return (
    <div className="message">
      <div className="message__left">
        <Avatar
          className="message__avatar"
          src={avatar}
          alt={`${name} ${uid} - Image`}
        />
      </div>
      <div className="message__right">
        <div className="message__details">
          <a href={`/users/${uid}`}>{name}</a>
          <small>{`${timestamp}`}</small>
        </div>
        <p className="message__text">{message}</p>
      </div>
    </div>
  )
}

export default Message
