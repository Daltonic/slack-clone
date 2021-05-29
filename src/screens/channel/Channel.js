import './Channel.css'
import { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
import CallIcon from '@material-ui/icons/Call'
import CallEndIcon from '@material-ui/icons/CallEnd'
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
  const [calling, setCalling] = useState(false)
  const [sessionID, setSessionID] = useState('')
  const [isIncomingCall, setIsIncomingCall] = useState(false)
  const [isOutgoingCall, setIsOutgoingCall] = useState(false)
  const [isLive, setIsLive] = useState(false)

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
      .then((member) => {
        setMembers((prevState) => [...prevState, member])
        alert('Member added successfully')
      })
      .catch((error) => {
        console.log('Something went wrong', error)
        alert(error.message)
      })
  }

  const remMember = (GUID, UID) => {
    if (channel.scope !== 'owner') return null

    CometChat.kickGroupMember(GUID, UID).then(
      (response) => {
        const index = members.findIndex((member) => member.uid === UID)
        members.splice(index, 1)
        console.log('Group member kicked successfully', response)
        alert('Member removed successfully')
      },
      (error) => {
        console.log('Group member kicking failed with error', error)
      }
    )
  }

  const listenForCall = (listnerID) => {
    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onIncomingCallReceived(call) {
          console.log('Incoming call:', call)
          // Handle incoming call
          setSessionID(call.sessionId)
          setIsIncomingCall(true)
          setCalling(true)
        },
        onOutgoingCallAccepted(call) {
          console.log('Outgoing call accepted:', call)
          // Outgoing Call Accepted
          startCall(call)
        },
        onOutgoingCallRejected(call) {
          console.log('Outgoing call rejected:', call)
          // Outgoing Call Rejected
          setIsIncomingCall(false)
          setIsOutgoingCall(false)
          setCalling(false)
        },
        onIncomingCallCancelled(call) {
          console.log('Incoming call calcelled:', call)
          setIsIncomingCall(false)
          setIsIncomingCall(false)
          setCalling(false)
        },
      })
    )
  }

  const startCall = (call) => {
    const sessionId = call.sessionId
    const callType = call.type
    const callSettings = new CometChat.CallSettingsBuilder()
      .setSessionID(sessionId)
      .enableDefaultLayout(true)
      .setIsAudioOnlyCall(callType === 'audio' ? true : false)
      .build()

    setSessionID(sessionId)
    setIsOutgoingCall(false)
    setIsIncomingCall(false)
    setCalling(false)
    setIsLive(true)

    CometChat.startCall(
      callSettings,
      document.getElementById('callScreen'),
      new CometChat.OngoingCallListener({
        onUserJoined: (user) => {
          /* Notification received here if another user joins the call. */
          console.log('User joined call:', user)
          /* this method can be use to display message or perform any actions if someone joining the call */
        },
        onUserLeft: (user) => {
          /* Notification received here if another user left the call. */
          console.log('User left call:', user)
          /* this method can be use to display message or perform any actions if someone leaving the call */
        },
        onUserListUpdated: (userList) => {
          console.log('user list:', userList)
        },
        onCallEnded: (call) => {
          /* Notification received here if current ongoing call is ended. */
          console.log('Call ended:', call)
          /* hiding/closing the call screen can be done here. */
          setIsIncomingCall(false)
          setIsOutgoingCall(false)
          setCalling(false)
          setIsLive(false)
        },
        onError: (error) => {
          console.log('Error :', error)
          /* hiding/closing the call screen can be done here. */
        },
        onMediaDeviceListUpdated: (deviceList) => {
          console.log('Device List:', deviceList)
        },
      })
    )
  }

  const initiateCall = () => {
    const receiverID = id //The uid of the user to be called
    const callType = CometChat.CALL_TYPE.VIDEO
    const receiverType = CometChat.RECEIVER_TYPE.GROUP

    const call = new CometChat.Call(receiverID, callType, receiverType)

    CometChat.initiateCall(call)
      .then((outGoingCall) => {
        console.log('Call initiated successfully:', outGoingCall)
        // perform action on success. Like show your calling screen.
        setSessionID(outGoingCall.sessionId)
        setIsOutgoingCall(true)
        setCalling(true)
      })
      .catch((error) => {
        console.log('Call initialization failed with exception:', error)
      })
  }

  const acceptCall = (sessionID) => {
    CometChat.acceptCall(sessionID)
      .then((call) => {
        console.log('Call accepted successfully:', call)
        // start the call using the startCall() method
        startCall(call)
      })
      .catch((error) => {
        console.log('Call acceptance failed with error', error)
        // handle exception
      })
  }

  const rejectCall = (sessionID) => {
    const status = CometChat.CALL_STATUS.REJECTED

    CometChat.rejectCall(sessionID, status)
      .then((call) => {
        console.log('Call rejected successfully', call)
        setCalling(false)
        setIsIncomingCall(false)
        setIsOutgoingCall(false)
        setIsLive(false)
      })
      .catch((error) => {
        console.log('Call rejection failed with error:', error)
      })
  }

  const endCall = (sessionID) => {
    CometChat.endCall(sessionID)
      .then((call) => {
        console.log('call ended', call)
        setCalling(false)
        setIsIncomingCall(false)
        setIsIncomingCall(false)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  const deleteChannel = (GUID) => {
    if (window.confirm('Are you sure?')) {
      CometChat.deleteGroup(GUID).then(
        (response) => {
          console.log('Channel deleted successfully:', response)
          window.location.href = '/'
        },
        (error) => {
          console.log('Channel delete failed with exception:', error)
        }
      )
    }
  }

  useEffect(() => {
    getChannel(id)
    getMessages(id)
    getMembers(id)
    listenForMessage(id)
    listenForCall(id)

    setCurrentUser(JSON.parse(localStorage.getItem('user')))
  }, [id])

  return (
    <div className="channel">
      {calling ? (
        <div className="callScreen">
          <div className="callScreen__container">
            <div className="call-animation">
              <img
                className="img-circle"
                src={channel?.avatar}
                alt=""
                width="135"
              />
            </div>
            {isOutgoingCall ? (
              <h4>Calling {channel?.name}</h4>
            ) : (
              <h4>{channel?.name} Calling</h4>
            )}

            {isIncomingCall ? (
              <div className="callScreen__btns">
                <Button onClick={() => acceptCall(sessionID)}>
                  <CallIcon />
                </Button>
                <Button onClick={() => rejectCall(sessionID)}>
                  <CallEndIcon />
                </Button>
              </div>
            ) : (
              <div className="callScreen__btns">
                <Button onClick={() => endCall(sessionID)}>
                  <CallEndIcon />
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        ''
      )}
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
              <CallIcon onClick={initiateCall} />
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
                {member?.scope !== 'admin' ? (
                  channel?.scope === 'admin' ? (
                    <PersonAddDisabledIcon
                      onClick={() => remMember(id, member?.uid)}
                      title={member?.scope}
                    />
                  ) : (
                    ''
                  )
                ) : (
                  <LockIcon title={member?.scope} />
                )}
              </div>
            ))}
          </div>
          {channel?.scope === 'owner' ? (
            <>
              <hr />
              <div className="channel__detailsMembers">
                <Button className="deleteBtn" onClick={() => deleteChannel(id)}>
                  Delete Channel
                </Button>
              </div>
            </>
          ) : (
            ''
          )}
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
                {currentUser.uid !== user?.uid ? (
                  channel?.scope === 'admin' ? (
                    <PersonAddOutlinedIcon
                      onClick={() => addMember(id, user?.uid)}
                    />
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isLive ? <div id="callScreen"></div> : ''}
    </div>
  )
}

export default Channel
