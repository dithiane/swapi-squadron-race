import React from "react"

const handleWinner = (text, toggleModal, saveWinner) => {
  saveWinner(text)
  toggleModal(false)
}
const info = (text, toggleModal, saveWinner) => (
  <div className="modal-content-info">
    <h1>We have the Winner</h1>
    <h1>{text}</h1>
    <button onClick={() => handleWinner(text, toggleModal, saveWinner)}>
      Close
    </button>
  </div>
)

const action = (text, toggleModal) => {
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

const Modal = ({ toggleModal, text, type, saveWinner }) => {
  return (
    <div>
      <div className="modal">
        {type === "info"
          ? info(text, toggleModal, saveWinner)
          : action(text, toggleModal)}
      </div>
    </div>
  )
}

export default Modal
