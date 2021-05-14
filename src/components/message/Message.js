import './Message.css'
import { useState } from 'react'
import { Avatar } from '@material-ui/core'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'

function Message({ uid, name, avatar, message, timestamp }) {
  const [hovered, setHovered] = useState(false)
  const toggleHover = () => setHovered(!hovered)

  const toReadableString = (time) => {
    if (time < 0) time = 0
    let hrs = ~~((time / 3600) % 24),
      mins = ~~((time % 3600) / 60),
      timeType = hrs > 11 ? 'PM' : 'AM'
    if (hrs > 12) hrs = hrs - 12
    if (hrs === 0) hrs = 12
    if (mins < 10) mins = '0' + mins
    return hrs + ':' + mins + timeType
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
            <small>{toReadableString(new Date(timestamp.toDate()))}</small>
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
