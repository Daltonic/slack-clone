import './Channel.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import LockIcon from '@material-ui/icons/Lock'
import Message from '../../components/message/Message'
import { CometChat } from '@cometchat-pro/chat'

function Detail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [detail, setChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const addMember = (guid, privacy) => {
    const GUID = guid
    const groupType = privacy
      ? CometChat.GROUP_TYPE.PUBLIC
      : CometChat.GROUP_TYPE.PRIVATE
    const password = ''

    CometChat.joinGroup(GUID, groupType, password)
      .then((group) => {
        console.log('Channel joined successfully:', group)
      })
      .catch((error) => {
        console.log('Group joining failed with exception:', error)
        alert(error.message)
      })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    sendMessage(id, message)
  }

  useEffect(() => {

    setUser(JSON.parse(localStorage.getItem('user')))
  }, [id])

  return (
    <div className="detail">
      <div className="detail__header">
        <div className="detail__headerLeft">
          <h4 className="detail__detailName">
            <strong>
              {detail?.privacy ? <LockIcon /> : '#'}
              {detail?.name}
            </strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className="detail__headerRight">
          <PersonAddOutlinedIcon />
          <InfoOutlinedIcon />
        </div>
      </div>

      <div id="messages-container" className="detail__messages">
        {messages.map((message) => (
          <Message
            uid={message?.uid}
            name={message.sender?.name}
            avatar={message.sender?.avatar}
            message={message?.text}
            timestamp={new Date(message?.timestamp).toJSON()}
            key={message?.sentAt}
          />
        ))}
      </div>

      <div className="detail__chatInput">
        <form>
          <input
            placeholder={`Message ${detail?.name.toLowerCase()}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" onClick={(e) => onSubmit(e)}>
            SEND
          </button>
        </form>
      </div>
    </div>
  )
}

export default Detail
