import './Chat.css'
import { useParams } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'

function Chat() {
  const { id } = useParams()
  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__headerLeft">
          <h4 className="chat__channelName">
            <strong>#general</strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className="chat__headerRight">
          <PersonAddOutlinedIcon />
          <InfoOutlinedIcon />
        </div>
      </div>
    </div>
  )
}

export default Chat
