import './Message.css'
import { useState } from 'react'
import { Avatar } from '@material-ui/core'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import Moment from 'react-moment'

function Message({ uid, name, avatar, message, timestamp }) {
  const [hovered, setHovered] = useState(false)
  const toggleHover = () => setHovered(!hovered)

  const toReadableString = (timestamp) => {
    const hours = timestamp.getHours()
    const minutes = '0' + timestamp.getMinutes()
    const seconds = '0' + timestamp.getSeconds()

    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
  }

  return (
    <div
      className="message"
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      <div className="message__data">
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
            <small>
              <Moment date={timestamp} format="hh:mm A" />
            </small>
          </div>
          <p className="message__text">{message}</p>
        </div>
      </div>

      <div
        className={
          hovered
            ? 'message__actions message__actions__show'
            : 'message__actions'
        }
      >
        <EditOutlinedIcon />
        <DeleteOutlinedIcon />
      </div>
    </div>
  )
}

export default Message
