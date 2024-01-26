import React from 'react'

const Avatar = ({ backgroundColor, px, py, borderRadius, fontSize, color, children }) => {
  const style = {
    backgroundColor,
    padding: `${px} ${py}`,
    margin: '5px 0px 5px 0px',
    borderRadius,
    color,
    fontSize,
    height: 'max-content',
  }

  return (
    <div style={style}>
      {children}
    </div>
  )
}

export default Avatar
