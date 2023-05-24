import React from "react"

const Squadron = ({
  fieldWidth,
  name,
  speed,
  weight,
  id,
  index,
  total,
  sendSquadronToAction,
}) => {
  const layoutDim = (width) => {
    if (width > 1024) return 3
    else if (width <= 1024) return 6
    else if (width <= 300) return 7
  }

  const getStartPosition = () => {
    const w = fieldWidth / total
    const dim = layoutDim(fieldWidth)
    let left = w * index + w / dim
    return left
  }
  const handleClick = (type) => {
    sendSquadronToAction(id, name, speed, type)
  }

  return (
    <div
      className={`squadron ship-${id}`}
      style={{ left: `${getStartPosition()}px` }}
      id={id}
      data-speed={`${speed}`}
      data-weight={`${weight}`}
    >
      <div className="name">{name}</div>

      {speed !== undefined ? (
        <>
          <button
            className="updateButton"
            onClick={() => handleClick("update")}
          >
            {speed}
          </button>
          <button
            className="deleteButton"
            onClick={() => handleClick("delete")}
          >
            Remove
          </button>
        </>
      ) : null}
    </div>
  )
}
export default Squadron
