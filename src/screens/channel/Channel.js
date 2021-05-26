import './Channel.css'
import { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
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
  const [channel, setChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState([])
  const [users, setUsers] = useState([])
  const [keyword, setKeyword] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
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

  const findUser = (e) => {
    e.preventDefault()

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
        setMessages((prevState) => [...prevState, message])
        setMessage('')
        scrollToEnd()
      })
      .catch((error) =>
        console.log('Message sending failed with error:', error)
      )
  }

  const addMember = (guid, uid) => {
    let GUID = guid
    let membersList = [
      new CometChat.GroupMember(uid, CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT),
    ]

    CometChat.addMembersToGroup(GUID, membersList, [])
      .then((member) => setMembers((prevState) => [...prevState, member]))
      .catch((error) => {
        console.log('Something went wrong', error)
      })
  }

  useEffect(() => {
    getChannel(id)
    getMessages(id)
    getMembers(id)
    listenForMessage(id)

    setCurrentUser(JSON.parse(localStorage.getItem('user')))
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
              uid={message?.sender.uid}
              name={message.sender?.name}
              avatar={message.sender?.avatar}
              message={message?.text}
              timestamp={message?.sentAt}
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
              <PersonAddOutlinedIcon onClick={togglerAdd} />
              Add
            </span>
            <span>
              <SearchIcon onClick={togglerAdd} />
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
              <div
                key={member?.uid}
                className={`available__member ${
                  member?.status === 'online' ? 'isOnline' : ''
                }`}
              >
                <Avatar src={member?.avatar} alt={member?.name} />
                <Link to={`/users/${member?.uid}`}>{member?.name}</Link>
                <FiberManualRecordIcon />
                {member?.scope !== 'admin' ? <PersonAddDisabledIcon /> : ''}
              </div>
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
          <form onSubmit={(e) => findUser(e)} className="channel__detailsForm">
            <input
              placeholder="Search for a user"
              onChange={(e) => setKeyword(e.target.value)}
              required
            />
            <Button onClick={(e) => findUser(e)}>
              {!searching ? 'Find' : <div id="loading"></div>}
            </Button>
          </form>
          <hr />
          <div className="channel__detailsMembers">
            <h4>Search Result({users.length})</h4>
            {users.map((user) => (
              <div
                key={user?.uid}
                className={`available__member ${
                  user?.status === 'online' ? 'isOnline' : ''
                }`}
              >
                <Avatar src={user?.avatar} alt={user?.name} />
                <Link to={`/users/${user?.uid}`}>{user?.name}</Link>
                <FiberManualRecordIcon />
                {currentUser.uid === user?.uid ? (
                  <PersonAddOutlinedIcon
                    onClick={() => addMember(id, user?.uid)}
                  />
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channel
