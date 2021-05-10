import './Sidebar.css'
import SidebarOption from '../sidebarOption/SidebarOption'
import CreateIcon from '@material-ui/icons/Create'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import InsertCommentIcon from '@material-ui/icons/InsertComment'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AddIcon from '@material-ui/icons/Add';
import { Avatar } from '@material-ui/core'

function Sidebar() {
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
      <hr/>
      <SidebarOption Icon={ArrowDropDownIcon} title="Channels" />
      <SidebarOption title="general" sub="sidebarOption__sub" />
      <SidebarOption Icon={LockOutlinedIcon} title="tutorials-daltonic" sub="sidebarOption__sub" />
      <SidebarOption Icon={AddIcon} title="Add Channel" sub="sidebarOption__sub" />
      <hr/>
      <SidebarOption Icon={ArrowDropDownIcon} title="Direct Messages" />
      <SidebarOption Icon={Avatar} title="Gospel Darlington" sub="sidebarOption__sub" />
      <SidebarOption Icon={Avatar} title="Priyanka Gurnani" sub="sidebarOption__sub" />
      <SidebarOption Icon={Avatar} title="Harsha Patil" sub="sidebarOption__sub" />
      <SidebarOption Icon={Avatar} title="Ajay Garg" sub="sidebarOption__sub" />
    </div>
  )
}

export default Sidebar
