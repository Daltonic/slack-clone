import React from 'react'
import './Header.css'
import { Avatar } from '@material-ui/core'
import AccessTimeIcon from '@material-ui/icons/AccessTime';

function Header() {
    return (
        <div className="header">
            <div className="header__left">
                <Avatar className="header__avatar" src="" alt=""/>
                <AccessTimeIcon/>
            </div>
            <div className="header__middle">
                {/* Search Icon */}
                {/* Search Input */}
            </div>
            <div className="header__right">
                {/* Help Icon */}
            </div>  
        </div>
    )
}

export default Header
