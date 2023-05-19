import React from "react"
import { useDispatch } from "react-redux"
import { deleteSquadron, updateSquadron } from "../services/squadrons"
const getStartPosition = (total, id) => ((100 / total) * (id + 1)) / 1.2
const Squadron = ({ name, speed, accel, id, index, total }) => {
  const dispatch = useDispatch()
  const handleDelete = (e) => {
    try {
      dispatch(deleteSquadron({ id: e.target.parentNode.id }))
    } catch (err) {
      console.error("Failed to delete the Squadron", err)
    }
  }

  const handleUpdate = () => {
    try {
      dispatch(updateSquadron({ id: e.target.parentNode.id }))
    } catch (err) {
      console.error("Failed to update the Squadron", err)
    }
  }

  return (
    <div
      className={`squadron ship-${id}`}
      style={{ left: `${getStartPosition(total, index)}%` }}
      id={id}
      data-speed={`${speed}`}
      data-accel={`${accel}`}
    >
      {name}
      <button className="deleteButton" onClick={handleDelete}>
        Remove
      </button>
      <button className="updateButton" onClick={handleUpdate}>
        Update
      </button>
    </div>
  )
}
export default Squadron
