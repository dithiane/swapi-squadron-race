import React from "react"

const getStartPosition = (total, id) => (100 / total) * (id + 1) - 14
const Squadron = ({
  name,
  speed,
  weight,
  id,
  index,
  total,
  sendSquadronToAction,
}) => {
  const handleClick = (type) => {
    sendSquadronToAction(id, name, speed, type)
  }

  return (
    <div
      className={`squadron ship-${id}`}
      style={{ left: `${getStartPosition(total, index)}%` }}
      id={id}
      data-speed={`${speed}`}
      data-weight={`${weight}`}
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
