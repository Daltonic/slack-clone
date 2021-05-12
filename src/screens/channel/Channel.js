import './Channel.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import db from '../../firebase'
import Message from '../../components/message/Message'

function Channel() {
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
    <div className="channel">
      <div className="channel__header">
        <div className="channel__headerLeft">
          <h4 className="channel__channelName">
            <strong>#{channel?.name}</strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className="channel__headerRight">
          <PersonAddOutlinedIcon />
          <InfoOutlinedIcon />
        </div>
      </div>
      
      <div className="channel__messages">
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
      </div>
    </div>
  )
}

export default Channel
