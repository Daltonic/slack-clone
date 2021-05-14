import './SidebarOption.css'
import { useHistory } from 'react-router-dom'
// import db from '../../firebase'

function SidebarOption({ Icon, title, sub, id, addChannelOption, user }) {
  const history = useHistory()
  const selectChannel = () => {
    if (id) {
      if (user) {
        history.push(`/users/${id}`)
      } else {
        history.push(`/channels/${id}`)
      }
    } else {
      history.push(title)
    }
  }

  const addChannel = () => {
    // const channelName = prompt('Please enter a channel name')

    // if (channelName) {
    //   db.collection('/channels').add({
    //     name: channelName,
    //     private: false,
    //   })
    // }
    const modal = document.getElementById('popup1')
    modal.setAttribute('class', 'overlay overlay__show')
  }

  return (
    <div
      className={`sidebarOption ${sub}`}
      onClick={addChannelOption ? addChannel : selectChannel}
    >
      {Icon && <Icon className="sidebarOption__icon" />}
      {Icon ? (
        <h3>{title}</h3>
      ) : (
        <h3 className="sidebarOption__channel">
          <span className="sidebarOption__hash">#</span> {title}
        </h3>
      )}
    </div>
  )
}

export default SidebarOption
