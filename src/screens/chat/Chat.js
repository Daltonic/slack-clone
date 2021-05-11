import './Chat.css'
import { useParams } from 'react-router-dom'

function Chat() {
    const { id } = useParams();
  return (
    <div className="chat">
      <h4>{id} Chat Screen Hallo!</h4>
      <div className="chat__header">
          <div className="chat__headerLeft">
              
          </div>
          <div className="chat__headerRight"></div>
      </div>
    </div>
  )
}

export default Chat
