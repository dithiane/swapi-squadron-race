import React from "react"

const getStartPosition = (total, id) => ((100 / total) * (id + 1)) / 1.2
const Squadron = ({ name, speed, accel, id, index, total, callSquadron }) => {
  const handleClick = (type) => {
    callSquadron(id, name, speed, type)
  }

  return (
    <div
      className={`squadron ship-${id}`}
      style={{ left: `${getStartPosition(total, index)}%` }}
      id={id}
      data-speed={`${speed}`}
      data-accel={`${accel}`}
    >
      <div>{name}</div>
      <button className="deleteButton" onClick={() => handleClick("delete")}>
        Remove
      </button>
      <button className="updateButton" onClick={() => handleClick("update")}>
        {speed}
      </button>
    </div>
  )
}
export default Squadron
