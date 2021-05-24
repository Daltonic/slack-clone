import './Add.css'
import { Button } from '@material-ui/core'
import { useState } from 'react'
import { CometChat } from '@cometchat-pro/chat'

function Add() {
  const [channel, setChannel] = useState('')
  const [privacy, setPrivacy] = useState('')
  const [loading, setLoading] = useState(false)

  const addChannel = () => {
    setLoading(true)
    if (channel === '' || privacy === '') {
      setLoading(false)
      alert('Please fill the form completely')
      return null
    }

    cometChatCreateGroup({
      channel,
      privacy,
      guid: generateGUID(),
    })
  }

  const cometChatCreateGroup = (data) => {
    const GUID = data.guid
    const groupName = data.channel
    const groupType = data.privacy
      ? CometChat.GROUP_TYPE.PUBLIC
      : CometChat.GROUP_TYPE.PRIVATE
    const password = ''

    const group = new CometChat.Group(GUID, groupName, groupType, password)

    CometChat.createGroup(group)
      .then((group) => {
        console.log('Group created successfully:', group)
        resetForm()
        window.location.href = `/channels/${data.guid}`
        setLoading(false)
      })
      .catch((error) => {
        console.log('Group creation failed with exception:', error)
        setLoading(false)
      })
  }

  const generateGUID = (length = 20) => {
    var result = []
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      )
    }
    return result.join('')
  }

  const resetForm = () => {
    setChannel('')
    setChannel('')
  }

  return (
    <div className="add">
      <form className="add__container">
        <img src="/logo.png" alt="Slack Logo" />
        <h1>Add New Channel</h1>
        <div className="add__form">
          <input
            name="channel"
            value={channel}
            placeholder="Channel Name"
            onChange={(e) => setChannel(e.target.value)}
            required
          />
        </div>

        <div className="add__form">
          <select
            name="privacy"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value === true)}
            required
          >
            <option value={''}>Select privacy</option>
            <option value={false}>Public</option>
            <option value={true}>Private</option>
          </select>
        </div>

        <Button onClick={addChannel}>
          {!loading ? 'Create Channel' : <div id="loading"></div>}
        </Button>
      </form>
    </div>
  )
}

export default Add
