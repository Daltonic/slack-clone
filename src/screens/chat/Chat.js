import './Chat.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import db from '../../firebase'

function Chat() {
  const { id } = useParams()
  const [channel, setChannel] = useState(null)

  useEffect(() => {
    db.collection('channels')
      .doc(id)
      .onSnapshot((snapshot) => {
        setChannel(snapshot.data())
      })
  }, [id])

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__headerLeft">
          <h4 className="chat__channelName">
            <strong>#{channel.name}</strong>
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
