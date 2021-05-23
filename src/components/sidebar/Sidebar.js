import './Sidebar.css'
import { useState, useEffect } from 'react'
import db, { auth } from '../../firebase'
import SidebarOption from '../sidebarOption/SidebarOption'
import CreateIcon from '@material-ui/icons/Create'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import InsertCommentIcon from '@material-ui/icons/InsertComment'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import AddIcon from '@material-ui/icons/Add'
import { Link, useHistory } from 'react-router-dom'

function Sidebar() {
  const [channels, setChannels] = useState([])
  const [user, setUser] = useState(null)
  const [dms, setDms] = useState([])
  const history = useHistory()

  const getDirectMessages = () => {
    db.collection('dms').onSnapshot((snapshot) => {
      setDms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      )
    })
  }

  const getChannels = () => {
    db.collection('channels').onSnapshot((snapshot) => {
      setChannels(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      )
    })
  }

  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem('user')
        history.push('/login')
      })
      .catch((error) => console.log(error.message))
  }

  useEffect(() => {
    getChannels()
    getDirectMessages()

    const data = localStorage.getItem('user')
    setUser(JSON.parse(data))
  }, [])

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__info">
          <h2>
            <Link to="/">Cometchat (e)</Link>
          </h2>
          <h3>
            <FiberManualRecordIcon />
            {user?.displayName.split(' ')[0]}
          </h3>
        </div>
        <CreateIcon />
      </div>
      <div className="sidebar__options">
        <SidebarOption Icon={InsertCommentIcon} title="Thread" />
        <SidebarOption Icon={AlternateEmailIcon} title="Mentions & Reactions" />
        <SidebarOption Icon={MoreVertIcon} title="More" />
        <hr />
        <SidebarOption Icon={ArrowDropDownIcon} title="Channels" />
        <hr />
        {channels.map((channel) =>
          channel.privacy ? (
            <SidebarOption
              Icon={LockOutlinedIcon}
              title={channel.name}
              id={channel.id}
              key={channel.id}
              sub="sidebarOption__sub"
            />
          ) : (
            <SidebarOption
              title={channel.name}
              id={channel.id}
              key={channel.id}
              sub="sidebarOption__sub"
            />
          )
        )}

        <SidebarOption
          Icon={AddIcon}
          title="Add Channel"
          sub="sidebarOption__sub"
          addChannelOption
        />
        <hr />
        <SidebarOption Icon={ArrowDropDownIcon} title="Direct Messages" />
        <hr />
        {dms.map((dm) => (
          <SidebarOption
            Icon={FiberManualRecordIcon}
            title={dm.name}
            id={dm.id}
            key={dm.id}
            sub="sidebarOption__sub sidebarOption__color"
            user
          />
        ))}
      </div>

      <button className="sidebar__logout" onClick={logOut}>
        Logout
      </button>
    </div>
  )
}

export default Sidebar
