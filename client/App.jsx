import React, { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchSquadrons,
  deleteSquadron,
  updateSquadron,
  createSquadron,
  selectData,
} from "./src/services/squadrons"
import { gsap } from "gsap"
import Modal from "./src/components/Portal"
import Squadron from "./src/components/Squadron"
gsap.registerPlugin(ScrollTrigger)
const SCROLL_FINISH = 320
const ACCELERATION_TO_FINISH = 200
const MAX_SPEED = 3500
const MIN_SPEED = 0
const MIN_WEIGHT = 1
const MAX_WEIGHT = 6

const App = () => {
  const [starShips, setStarShips] = useState(null)
  const [deployed, setDeployed] = useState(false)
  const [winner, setWinner] = useState(null)
  const [showModal, setShowModal] = useState(true)
  const [type, setType] = useState("start")
  const [squadron, setSquadron] = useState(null)
  const [yourStarShip, setYourStartShip] = useState(null)
  const [direction, setDirection] = useState(true)

  const dispatch = useDispatch()
  const squadrons = useSelector(selectData)
  const ref = useRef(null)
  const refSquadrons = useRef(null)

  const onScroll = () => {
    if (refSquadrons.current && !winner) {
      console.log(direction)
      let sqArray = [...refSquadrons.current.childNodes]
      sqArray.some((el) => {
        let currentY = parseFloat(String(el.style.transform).split(",")[1])
        let checkFinish =
          window.pageYOffset > SCROLL_FINISH &&
          window.pageYOffset + currentY < ACCELERATION_TO_FINISH
        if (checkFinish) {
          setWinner(el.firstChild.innerText)
        }
        return Boolean(checkFinish)
      })
    }
  }

  useEffect(() => {
    if (winner) {
      setType("info")
      setShowModal(true)
    }
  }, [winner])

  useEffect(() => {
    window.removeEventListener("scroll", onScroll)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const countElements = ref.current.childNodes.length
    setDeployed(countElements >= 1 ? true : false)
  })
  useEffect(() => {
    setStarShips(squadrons)
  }, [squadrons])

  const saveWinner = (text) => {
    console.log(text)
    setWinner(null)
  }

  const getY = (el) =>
    1 -
    (parseFloat(el.getAttribute("data-speed")) /
      1000 /
      (2 * el.getAttribute("data-weight"))) *
      ScrollTrigger.maxScroll(window)

  useLayoutEffect(() => {
    if (deployed) {
      gsap.set(".squadron", {
        borderBottom:
          "100px solid rgb(random(0,190), random(0,190), random(0,1)",
      })
      gsap.utils.toArray("[data-speed]").forEach((el) => {
        gsap.to(el, {
          y: () => getY(el),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "-=500",
            end: "top",
            invalidateOnRefresh: true,
            scrub: true,
            onUpdate: (self) => {
              if (self.direction === 1) setShowModal(true)
              else setShowModal(false)
            },
          },
        })
      })
    }
  }, [deployed, squadrons])
  const deploySquadrons = () => (
    <div ref={refSquadrons}>
      {starShips.map((el, index) => (
        <Squadron
          key={index}
          name={
            yourStarShip && yourStarShip.id === index
              ? yourStarShip.name
              : el.name
          }
          speed={el.speed}
          weight={el.weight}
          id={el.squadron_id}
          index={index}
          total={starShips.length}
          callSquadron={callSquadron}
        />
      ))}
    </div>
  )

  useEffect(() => {
    if (!showModal && !winner) dispatch(fetchSquadrons())
  }, [showModal])

  useEffect(() => {
    if (squadron) setShowModal(true)
  }, [squadron])

  const callSquadron = (id, name, speed, type) => {
    setSquadron({ id, name, speed })
    setType(type)
  }

  const handleWinner = (text) => {
    saveWinner(text)
    setShowModal(false)
  }

  const handleDelete = (id) => {
    try {
      dispatch(deleteSquadron({ id }))
    } catch (err) {
      console.error("Failed to delete the Squadron", err)
    }
    setShowModal(false)
  }

  const controlParams = (param, min, max) => {
    let currentParam = max
    if (param <= max) currentSpeed = param
    if (param <= max) currentSpeed = min
    return currentParam
  }

  const handleUpdate = (id, currentSpeed) => {
    const speed = controlParams(currentSpeed, MIN_SPEED, MAX_SPEED)
    try {
      dispatch(updateSquadron({ id, speed }))
    } catch (err) {
      console.error("Failed to update the Squadron", err)
    }
    setShowModal(false)
  }

  const handleCreate = ({ name, currentSpeed, currentWeigh }) => {
    const speed = controlParams(currentSpeed, MIN_SPEED, MAX_SPEED)
    const weight = controlParams(currentWeigh, MIN_WEIGHT, MAX_WEIGHT)
    try {
      dispatch(createSquadron({ name, speed, weight }))
    } catch (err) {
      console.error("Failed to create the Squadron", err)
    }
    setShowModal(false)
  }

  const assignSquadron = (e) => {
    e.preventDefault()
    const randomId = Math.floor(Math.random() * starShips.length)
    setYourStartShip({ id: randomId, name: `You` })
  }

  const createNewSquadron = () => {
    setType("create")
    setShowModal(true)
  }

  return (
    <>
      <div className={`controls-${showModal}`}>
        <button onClick={(e) => createNewSquadron(e)}>
          Create New Squadron
        </button>
        <button onClick={(e) => assignSquadron(e)}>Select Squadron</button>
      </div>
      {showModal ? (
        <Modal
          className="fade-up"
          text={winner}
          type={type}
          squadron={squadron}
          toggleModal={setShowModal}
          handleWinner={handleWinner}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          handleCreate={handleCreate}
        />
      ) : null}
      <div className="field" ref={ref}>
        {starShips ? deploySquadrons() : null}
      </div>
    </>
  )
}

export default App
