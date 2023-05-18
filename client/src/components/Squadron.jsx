import React from "react"
const Squadron = ({ name, id, speed }) => {
  return (
    <div
      className={`squadron ship-${id}`}
      style={{ left: `${id}0%` }}
      data-speed={`${speed}`}
    >
      {name}
      <button className="deleteButton">Remove</button>
      <button className="updateButton">Update</button>
    </div>
  )
}
export default Squadron
