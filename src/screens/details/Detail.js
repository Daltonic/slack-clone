import './Detail.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import LockIcon from '@material-ui/icons/Lock'
import { CometChat } from '@cometchat-pro/chat'

function Detail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [detail, setDetail] = useState(null)

  const addMember = (guid, privacy) => {
    const GUID = guid
    const groupType = privacy
      ? CometChat.GROUP_TYPE.PUBLIC
      : CometChat.GROUP_TYPE.PRIVATE
    const password = ''

    CometChat.joinGroup(GUID, groupType, password)
      .then((group) => {
        console.log('Member added successfully:', group)
      })
      .catch((error) => {
        console.log('Group joining failed with exception:', error)
        alert(error.message)
      })
  }

  const onSubmit = (e) => {
    e.preventDefault()
  }

  useEffect(() => {

    setUser(JSON.parse(localStorage.getItem('user')))
  }, [id])

  return (
    <div className="detail">
      <div className="detail__header">
        <div className="detail__headerLeft">
          <h4 className="detail__detailName">
            <strong>
              {detail?.privacy ? <LockIcon /> : '#'}
              {detail?.name}
            </strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className="detail__headerRight">
          <PersonAddOutlinedIcon />
          <InfoOutlinedIcon />
        </div>
      </div>
    </div>
  )
}

export default Detail
