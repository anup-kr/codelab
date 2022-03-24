import React from 'react'
import Avatar from 'react-avatar'

const Client = ( {username} ) => {
  return (
    <div className="client">
        <Avatar name={username} size='46px' round='10px'></Avatar>
        <span className="clientInfo">{username}</span>
    </div>
  )
}

export default Client