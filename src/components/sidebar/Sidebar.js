import './Sidebar.css'
import CreateIcon from '@material-ui/icons/Create'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'

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
    </div>
  )
}

export default Sidebar
