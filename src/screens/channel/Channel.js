import './Channel.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import LockIcon from '@material-ui/icons/Lock'
import db from '../../firebase'
import Message from '../../components/message/Message'
import { CometChat } from '@cometchat-pro/chat'

function Channel() {
  const { id } = useParams()
  const [channel, setChannel] = useState(null)
  const [messages, setMessages] = useState([])

  const getChannel = (id) => {
    db.collection('channels')
      .doc(id)
      .onSnapshot((snapshot) => {
        setChannel(snapshot.data())
      })
  }

  const getChannelMessages = (id) => {
    db.collection(`channels/${id}/messages`)
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      })
  }

  const getMessages = (guid) => {
    const limit = 50

    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setLimit(limit)
      .setGUID(guid)
      .build()

    messagesRequest
      .fetchPrevious()
      .then((messages) => {
        this.messages = messages.filter((m) => m.type === 'text')
      })
      .catch((error) =>
        console.log('Message fetching failed with error:', error)
      )
  }

  // const scrollToEnd = () => {
  //   const elmnt = document.getElementById('messages-container')
  //   elmnt.scrollTop = elmnt.scrollHeight
  // }

  const sendMessage = (e) => {
    e.preventDefault()
    console.log(e.target.value)
  }

  useEffect(() => {
    getChannel(id)
    getChannelMessages(id)
  }, [id])

  return (
    <div className="channel">
      <div className="channel__header">
        <div className="channel__headerLeft">
          <h4 className="channel__channelName">
            <strong>
              {channel?.privacy ? <LockIcon /> : '#'}
              {channel?.name}
            </strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className="channel__headerRight">
          <PersonAddOutlinedIcon />
          <InfoOutlinedIcon />
        </div>
      </div>

      <div id="messages-container" className="channel__messages">
        {messages.map((message) => (
          <Message
            uid={message?.uid}
            name={message?.name}
            avatar={message?.avatar}
            message={message?.message}
            timestamp={message?.timestamp}
            key={message?.uid}
          />
        ))}
      </div>

      <div className="chatInput">
        <form>
          <input placeholder={`Message ${channel?.name.toLowerCase()}`} />
          <button type="submit" onClick={(e) => sendMessage(e)}>
            SEND
          </button>
        </form>
      </div>
    </div>
  )
}

export default Channel
