import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteSquadron } from "../services/squadrons"
const getStartPosition = (total, id) => ((100 / total) * (id + 1)) / 1.2
const Squadron = ({ name, speed, accel, id, index, total }) => {
  const dispatch = useDispatch()
  const handleDelete = (e) => {
    try {
      dispatch(deleteSquadron({ id: e.target.parentNode.id })).unwrap()
    } catch (err) {
      console.error("Failed to delete the Squadron", err)
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
      <button className="updateButton">Update</button>
    </div>
  )
}
export default Squadron
