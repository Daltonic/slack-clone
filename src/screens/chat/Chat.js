import './Chat.css'
import { useParams } from 'react-router-dom'

function Chat() {
    const { id } = useParams();
  return (
    <div className="chat">
      <h4>{id} Chat Screen Hallo!</h4>
    </div>
  )
}

export default Chat
