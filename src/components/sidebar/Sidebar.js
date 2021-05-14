import './Sidebar.css'
import { useState, useEffect } from 'react'
import db from '../../firebase'
import SidebarOption from '../sidebarOption/SidebarOption'
import CreateIcon from '@material-ui/icons/Create'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import InsertCommentIcon from '@material-ui/icons/InsertComment'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import AddIcon from '@material-ui/icons/Add'

function Sidebar() {
  const [channels, setChannels] = useState([])
  const [dms, setDms] = useState([])

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

  useEffect(() => {
    getChannels()
    getDirectMessages()
  }, [])

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__info">
          <h2>Cometchat (e)</h2>
          <h3>
            <FiberManualRecordIcon />
            Daltonic
          </h3>
        </div>
        <CreateIcon />
      </div>
      <SidebarOption Icon={InsertCommentIcon} title="Thread" />
      <SidebarOption Icon={AlternateEmailIcon} title="Mentions & Reactions" />
      <SidebarOption Icon={MoreVertIcon} title="More" />
      <hr />
      <SidebarOption Icon={ArrowDropDownIcon} title="Channels" />
      <hr />
      {channels.map((channel) =>
        channel.private ? (
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
  )
}

export default Sidebar
