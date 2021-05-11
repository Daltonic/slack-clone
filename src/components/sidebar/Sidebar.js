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
import { Avatar } from '@material-ui/core'

function Sidebar() {
  const [channels, setChannels] = useState([])

  function getChannels() {
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
            key={channel.id}
            sub="sidebarOption__sub"
          />
        ) : (
          <SidebarOption
            title={channel.name}
            key={channel.id}
            sub="sidebarOption__sub"
          />
        )
      )}

      <SidebarOption
        Icon={AddIcon}
        title="Add Channel"
        sub="sidebarOption__sub"
      />
      <hr />
      <SidebarOption Icon={ArrowDropDownIcon} title="Direct Messages" />
      <hr />
      <SidebarOption
        Icon={Avatar}
        title="Gospel Darlington"
        sub="sidebarOption__sub"
      />
      <SidebarOption
        Icon={Avatar}
        title="Priyanka Gurnani"
        sub="sidebarOption__sub"
      />
      <SidebarOption
        Icon={Avatar}
        title="Harsha Patil"
        sub="sidebarOption__sub"
      />
      <SidebarOption Icon={Avatar} title="Ajay Garg" sub="sidebarOption__sub" />
    </div>
  )
}

export default Sidebar
