import React, { useState } from "react"

const Modal = ({
  toggleModal,
  text,
  type,
  squadron,
  handleWinner,
  handleUpdate,
  handleDelete,
  handleCreate,
}) => {
  const [name, setName] = useState(squadron?.name)
  const [speed, setSpeed] = useState(squadron?.speed)
  const [weight, setWeight] = useState(squadron?.weight)
  const info = (text, handleWinner) => (
    <div className="modal-content-info">
      <h1>We have the Winner</h1>
      <h1>{text}</h1>
      <button onClick={() => handleWinner(text)}>Close</button>
    </div>
  )

  const start = (text, toggleModal) => {
    return (
      <div className="modal-content-action">
        <div>
          <h1>Welcome to the SWAPI</h1>
        </div>
        <p>{text}</p>
        <footer>
          <button onClick={() => toggleModal(false)}>Play</button>
        </footer>
      </div>
    )
  }

  const updateSquadron = (squadron) => {
    return (
      <div className="modal-content-info">
        <h1>{`Upgrade the ${squadron.name} speed`}</h1>
        <input
          type="text"
          id="speed"
          value={speed}
          onInput={(e) => setSpeed(e.target.value)}
        />
        <button onClick={(e) => handleUpdate(squadron.id, speed)}>
          Update
        </button>
        <button onClick={() => toggleModal(false)}>No</button>
      </div>
    )
  }

  const createSquadron = (squadron) => {
    return (
      <div className="modal-content-info">
        <h1>Create the New Squadron</h1>
        <input
          type="text"
          id="name"
          value={name}
          placeholder="Name"
          onInput={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          id="speed"
          value={speed}
          placeholder="Speed"
          onInput={(e) => setSpeed(e.target.value)}
        />
        <input
          type="text"
          id="weight"
          value={weight}
          placeholder="Weight"
          onInput={(e) => setWeight(e.target.value)}
        />
        <button onClick={(e) => handleCreate({ name, speed, weight })}>
          Create
        </button>
        <button onClick={() => toggleModal(false)}>No</button>
      </div>
    )
  }

  const deleteSquadron = (squadron) => {
    return (
      <div className="modal-content-info">
        <h1>{`Are you sure want to delete the ${squadron.name}`}</h1>
        <button onClick={(e) => handleDelete(squadron.id)}>Yes</button>
        <button onClick={() => toggleModal(false)}>No</button>
      </div>
    )
  }

  const cases = (
    toggleModal,
    text,
    type,
    squadron,
    handleWinner,
    handleUpdate,
    handleDelete
  ) => {
    switch (type) {
      case "info":
        return info(text, handleWinner)
      case "start":
        return start(text, toggleModal)
      case "delete":
        return deleteSquadron(squadron, handleDelete)
      case "update":
        return updateSquadron(squadron, handleUpdate)
      default:
        return createSquadron(squadron, handleCreate)
        break
    }
  }
  return (
    <div>
      <div className="modal">
        {cases(toggleModal, text, type, squadron, handleWinner, handleUpdate)}
      </div>
    </div>
  )
}

export default Modal
