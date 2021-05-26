import './User.css'
import { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import CallIcon from '@material-ui/icons/Call'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import SearchIcon from '@material-ui/icons/Search'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import CloseIcon from '@material-ui/icons/Close'
import Message from '../../components/message/Message'
import { CometChat } from '@cometchat-pro/chat'
import { Avatar, Button } from '@material-ui/core'

function User() {
  const { id } = useParams()
  const history = useHistory()
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [keyword, setKeyword] = useState(null)
  const [message, setMessage] = useState('')
  const [searching, setSearching] = useState(false)
  const [toggle, setToggle] = useState(false)

  const togglerDetail = () => {
    setToggle(!toggle)
  }

  const findUser = (e) => {
    e.preventDefault();

    searchTerm(keyword)
  }

  const searchTerm = (keyword) => {
    setSearching(true)
    const limit = 30
    const usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .setSearchKeyword(keyword)
      .build()

    usersRequest
      .fetchNext()
      .then((userList) => {
        setUsers(userList)
        setSearching(false)
      })
      .catch((error) => {
        console.log('User list fetching failed with error:', error)
        setSearching(false)
      })
  }

  const getUser = (UID) => {
    CometChat.getUser(UID)
      .then((user) => setUser(user))
      .catch((error) => {
        console.log('User details fetching failed with error:', error)
      })
  }

  const getMessages = (uid) => {
    const limit = 50

    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setLimit(limit)
      .setUID(uid)
      .build()

    messagesRequest
      .fetchPrevious()
      .then((msgs) => {
        setMessages(msgs.filter((m) => m.type === 'text'))
        scrollToEnd()
      })
      .catch((error) =>
        console.log('Message fetching failed with error:', error)
      )
  }

  const listFriend = () => {
    const limit = 30
    const usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .friendsOnly(true)
      .build()

    usersRequest
      .fetchNext()
      .then((userList) => {
        console.log('User list received:', userList)
      })
      .catch((error) => {
        console.log('User list fetching failed with error:', error)
      })
  }

  const listenForMessage = (listenerID) => {
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (message) => {
          setMessages((prevState) => [...prevState, message])
          scrollToEnd()
        },
      })
    )
  }

  const scrollToEnd = () => {
    const elmnt = document.getElementById('messages-container')
    elmnt.scrollTop = elmnt.scrollHeight
  }

  const onSubmit = (e) => {
    e.preventDefault()
    sendMessage(id, message)
  }

  const sendMessage = (uid, message) => {
    const receiverID = uid
    const messageText = message
    const receiverType = CometChat.RECEIVER_TYPE.USER
    const textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType
    )

    CometChat.sendMessage(textMessage)
      .then((message) => {
        setMessages((prevState) => [...prevState, message])
        setMessage('')
        scrollToEnd()
      })
      .catch((error) =>
        console.log('Message sending failed with error:', error)
      )
  }

  useEffect(() => {
    getUser(id)
    getMessages(id)
    listenForMessage(id)
    listFriend()
  }, [id])

  return (
    <div className="user">
      <div className="user__chat">
        <div className="user__header">
          <div className="user__headerLeft">
            <h4 className="user__userName">
              <strong className={user?.status === 'online' ? 'isOnline' : ''}>
                <FiberManualRecordIcon />
                {user?.name}
              </strong>
              <StarBorderOutlinedIcon />
            </h4>
          </div>
          <div className="user__headerRight">
            <CallIcon />
            <InfoOutlinedIcon onClick={togglerDetail} />
          </div>
        </div>

        <div id="messages-container" className="user__messages">
          {messages.map((message) => (
            <Message
              uid={message?.sender.uid}
              name={message.sender?.name}
              avatar={message.sender?.avatar}
              message={message?.text}
              timestamp={message?.sentAt}
              key={message?.sentAt}
            />
          ))}
        </div>

        <div className="user__chatInput">
          <form>
            <input
              placeholder={`Message ${user?.name.toLowerCase()}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" onClick={(e) => onSubmit(e)}>
              SEND
            </button>
          </form>
        </div>
      </div>

      <div className={`user__details ${!toggle ? 'hide__details' : ''}`}>
        <div className="user__header">
          <div className="user__headerLeft">
            <h4 className="user__userName">
              <strong>Details</strong>
            </h4>
          </div>
          <div className="user__headerRight">
            <CloseIcon onClick={togglerDetail} />
          </div>
        </div>
        <div className="user__detailsBody">
          <div className="user__detailsIdentity">
            <img src={user?.avatar} alt={user?.name} />
            <h4 className={user?.status === 'online' ? 'isOnline' : ''}>
              {user?.name}
              <FiberManualRecordIcon />
            </h4>
          </div>
          <div className="user__detailsActions">
            <span>
              <SearchIcon />
              Find
            </span>
            <span>
              <CallIcon />
              Call
            </span>
            <span>
              <MoreHorizIcon />
              More
            </span>
          </div>
          <form onSubmit={e => findUser(e)} className="channel__detailsForm">
            <input
              placeholder="Search for a user"
              onChange={(e) => setKeyword(e.target.value)}
              required
            />
            <Button onClick={e => findUser(e)}>
              {!searching ? 'Find' : <div id="loading"></div>}
            </Button>
          </form>
          <hr />
          <div className="channel__detailsMembers">
            <h4>Users</h4>
            {users.map((user) => (
              <Link
                key={user?.uid}
                to={`/users/${user?.uid}`}
                className={user?.status === 'online' ? 'isOnline' : ''}
              >
                <Avatar src={user?.avatar} alt={user?.name} />
                {user?.name}
                <FiberManualRecordIcon />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
