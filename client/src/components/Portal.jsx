import React, { useState } from "react"

const Modal = ({
  text,
  type,
  squadron,
  winners,
  toggleModal,
  handleUpdate,
  handleDelete,
  handleCreate,
  handleShow,
}) => {
  const [name, setName] = useState(squadron ? squadron.name : "")
  const [speed, setSpeed] = useState(squadron ? squadron.speed : "")
  const [weight, setWeight] = useState(squadron ? squadron.weight : "")
  const info = () => (
    <div className="modal-content-info">
      <h1>We have the Winner</h1>
      <h1>{text}</h1>
      <button onClick={() => toggleModal()}>Close</button>
    </div>
  )

  const start = () => {
    return (
      <div className="modal-content-action">
        <div>
          <h1>Welcome to the SWAPI</h1>
        </div>
        <p>{text}</p>
        <footer>
          <button onClick={() => toggleModal()}>Play</button>
        </footer>
      </div>
    )
  }

  const updateSquadron = () => {
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
        <button onClick={() => toggleModal()}>No</button>
      </div>
    )
  }

  const createSquadron = () => {
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
        <button onClick={() => toggleModal()}>No</button>
      </div>
    )
  }

  const deleteSquadron = () => {
    return (
      <div className="modal-content-info">
        <h1>{`Are you sure want to delete the ${squadron.name}`}</h1>
        <button onClick={(e) => handleDelete(squadron.id)}>Yes</button>
        <button onClick={() => toggleModal()}>No</button>
      </div>
    )
  }

  const showWinners = () => {
    return (
      <div className="modal-content-info">
        <h1>Winners</h1>
        {winners.map((el, index) => (
          <div key={index} className="winners">
            <h2>{el.name}</h2>
            <h2>{el.times}</h2>
          </div>
        ))}
        <button onClick={() => handleShow()}>Close</button>
      </div>
    )
  }

  const cases = () => {
    switch (type) {
      case "info":
        return info()
      case "start":
        return start()
      case "delete":
        return deleteSquadron()
      case "update":
        return updateSquadron()
      case "create":
        return createSquadron()
      case "show":
        return showWinners()
    }
  }
  return (
    <div>
      <div className="modal">{cases()}</div>
    </div>
  )
}

export default Modal
