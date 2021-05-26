import './Channel.css'
import { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import CallIcon from '@material-ui/icons/Call'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import SearchIcon from '@material-ui/icons/Search'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import CloseIcon from '@material-ui/icons/Close'
import LockIcon from '@material-ui/icons/Lock'
import Message from '../../components/message/Message'
import { CometChat } from '@cometchat-pro/chat'
import { Avatar, Button } from '@material-ui/core'

function Channel() {
  const { id } = useParams()
  const history = useHistory()
  const [user, setUser] = useState(null)
  const [channel, setChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState([])
  const [users, setUsers] = useState([])
  const [keyword, setKeyword] = useState(null)
  const [message, setMessage] = useState('')
  const [searching, setSearching] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [toggleAdd, setToggleAdd] = useState(false)

  const togglerDetail = () => {
    setToggle(!toggle)
  }

  const togglerAdd = () => {
    setToggleAdd(!toggleAdd)
  }

  const findUser = () => {
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

  const getMembers = (guid) => {
    const GUID = guid
    const limit = 30
    const groupMemberRequest = new CometChat.GroupMembersRequestBuilder(GUID)
      .setLimit(limit)
      .build()

    groupMemberRequest
      .fetchNext()
      .then((groupMembers) => setMembers(groupMembers))
      .catch((error) => {
        console.log('Group Member list fetching failed with exception:', error)
      })
  }

  const getChannel = (guid) => {
    CometChat.getGroup(guid)
      .then((group) => setChannel(group))
      .catch((error) => {
        if (error.code === 'ERR_GUID_NOT_FOUND') history.push('/')
        console.log('Group details fetching failed with exception:', error)
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
      .then((msgs) => {
        setMessages(msgs.filter((m) => m.type === 'text'))
        scrollToEnd()
      })
      .catch((error) =>
        console.log('Message fetching failed with error:', error)
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

  const sendMessage = (guid, message) => {
    const receiverID = guid
    const messageText = message
    const receiverType = CometChat.RECEIVER_TYPE.GROUP
    const textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType
    )

    CometChat.sendMessage(textMessage)
      .then((message) => {
        messages.push(message)
        setMessage('')
        scrollToEnd()
      })
      .catch((error) =>
        console.log('Message sending failed with error:', error)
      )
  }

  useEffect(() => {
    getChannel(id)
    getMessages(id)
    getMembers(id)

    setUser(JSON.parse(localStorage.getItem('user')))
  }, [id])

  return (
    <div className="channel">
      <div className="channel__chat">
        <div className="channel__header">
          <div className="channel__headerLeft">
            <h4 className="channel__channelName">
              <strong>
                {channel?.type === 'private' ? <LockIcon /> : '#'}
                {channel?.name}
              </strong>
              <StarBorderOutlinedIcon />
            </h4>
          </div>
          <div className="channel__headerRight">
            <PersonAddOutlinedIcon onClick={togglerAdd} />
            <InfoOutlinedIcon onClick={togglerDetail} />
          </div>
        </div>

        <div id="messages-container" className="channel__messages">
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

        <div className="channel__chatInput">
          <form>
            <input
              placeholder={`Message ${channel?.name.toLowerCase()}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" onClick={(e) => onSubmit(e)}>
              SEND
            </button>
          </form>
        </div>
      </div>

      <div className={`channel__details ${!toggle ? 'hide__details' : ''}`}>
        <div className="channel__header">
          <div className="channel__headerLeft">
            <h4 className="channel__channelName">
              <strong>Details</strong>
            </h4>
          </div>
          <div className="channel__headerRight">
            <CloseIcon onClick={togglerDetail} />
          </div>
        </div>
        <div className="channel__detailsBody">
          <div className="channel__detailsActions">
            <span>
              <PersonAddOutlinedIcon />
              Add
            </span>
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
          <hr />
          <div className="channel__detailsMembers">
          <h4>Members({members.length})</h4>
            {members.map((member) => (
              <Link
                key={member?.uid}
                to={`/users/${member?.uid}`}
                className={member?.status === 'online' ? 'isOnline' : ''}
              >
                <Avatar src={member?.avatar} alt={member?.name} />
                {member?.name}
                <FiberManualRecordIcon />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={`channel__details ${!toggleAdd ? 'hide__details' : ''}`}>
        <div className="channel__header">
          <div className="channel__headerLeft">
            <h4 className="channel__channelName">
              <strong>Add Member</strong>
            </h4>
          </div>
          <div className="channel__headerRight">
            <CloseIcon onClick={togglerAdd} />
          </div>
        </div>
        <div className="channel__detailsBody">
          <form className="channel__detailsForm">
            <input
              type="search"
              placeholder="Search for a user"
              onChange={(e) => setKeyword(e.target.value)}
              required
            />
            <Button onClick={findUser}>
              {!searching ? 'Find' : <div id="loading"></div>}
            </Button>
          </form>
          <hr />
          <div className="channel__detailsMembers">
            <h4>Search Result({users.length})</h4>
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

export default Channel
