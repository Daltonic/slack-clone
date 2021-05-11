import './User.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import db from '../../firebase'

function User() {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    db.collection('dms')
      .doc(id)
      .onSnapshot((snapshot) => {
        setUser(snapshot.data())
      })
  }, [id])

  return (
    <div className="user">
      <div className="user__header">
        <div className="user__headerLeft">
          <h4 className="user__userName">
            <strong>
              <FiberManualRecordIcon />
              {user?.name}
            </strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className="user__headerRight">
          <PersonAddOutlinedIcon />
          <InfoOutlinedIcon />
        </div>
      </div>
    </div>
  )
}

export default User
