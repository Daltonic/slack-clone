import './Header.css'
import { Avatar } from '@material-ui/core'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import SearchIcon from '@material-ui/icons/Search'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { useState, useEffect } from 'react'

function Header() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const data = localStorage.getItem('user')
    setUser(JSON.parse(data))
  }, [])
  
  return (
    <div className="header">
      <div className="header__left">
        <AccessTimeIcon />
      </div>
      <div className="header__middle">
        <SearchIcon />
        <input placeholder="Search tutorial-daltonic" />
      </div>
      <div className="header__right">
        <HelpOutlineIcon />
        <Avatar className="header__avatar" src={user?.photoURL} alt={user?.displayName} />
      </div>
    </div>
  )
}

export default Header
