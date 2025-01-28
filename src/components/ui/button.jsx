import React from 'react'

export default function Button({onClick, label,...props}) {
  return (
    <button onClick={onClick} {...props} >{label}</button>
  )
}
