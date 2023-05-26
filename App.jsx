import React, { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchSquadrons,
  fetchWinners,
  deleteSquadron,
  updateSquadron,
  updateWinner,
  createSquadron,
  selectData,
} from "./src/services/squadrons"
import { gsap } from "gsap"
import Modal from "./src/components/Portal"
import Squadron from "./src/components/Squadron"
gsap.registerPlugin(ScrollTrigger)

const MAX_SPEED = 3500
const MIN_SPEED = 0
const MIN_WEIGHT = 1
const MAX_WEIGHT = 6

const App = () => {
  const [starShips, setStarShips] = useState(null)
  const [deployed, setDeployed] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [type, setType] = useState("start")
  const [squadron, setSquadron] = useState(null)
  const [yourStarShip, setYourStartShip] = useState(null)
  const [fieldWidth, setFieldWidth] = useState(window.innerWidth)

  const dispatch = useDispatch()
  const squadrons = useSelector(selectData)
  const ref = useRef(null)
  const refSquadrons = useRef(null)
  const refTop = useRef(null)
  const refWinner = useRef(null)
  const refAction = useRef(false)

  const setStart = () => {
    if (refSquadrons.current) {
      let sqArray = [...refSquadrons.current.childNodes]
      sqArray.forEach((el) => gsap.to(el, { y: "0px" }))
    }
  }

  const pushWinner = (el) => {
    refWinner.current = el
    setType("info")
    toggleModal()
    saveWinner(el.id)
  }

  const scrollToTop = () => {
    refTop.current?.scrollIntoView({ behavior: "smooth" })
  }

  const onScroll = (e) => {
    if (!refAction.current) addAction()
    if (e.deltaY > 0) {
      if (refSquadrons.current && !refWinner.current) {
        let sqArray = [...refSquadrons.current.childNodes]
        sqArray.some((el) => {
          if (!ScrollTrigger.isInViewport(el, 0.2)) {
            pushWinner(el)
            return true
          }
        })
      }
    }
  }

  const onResize = () => {
    const windowsWidth =
      window.innerWidth && document.documentElement.clientWidth
        ? Math.min(window.innerWidth, document.documentElement.clientWidth)
        : window.innerWidth ||
          document.documentElement.clientWidth ||
          document.getElementsByTagName("body")[0].clientWidth
    setFieldWidth(windowsWidth)
    getParticlesAnimation()
    scrollToTop()
  }

  const getParticlesAnimation = () => {
    let i = 50

    while (--i > -1) {
      let dot = document.createElement("div")
      let dotContainer = document.getElementById("space")
      dot.className = "dot"
      dotContainer.append(dot)
      gsap.to(dot, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * Math.PI * 10,
      })
      gsap.to(dot, {
        duration: 30,
        z: 100,
      })
    }
  }

  useEffect(() => {
    dispatch(fetchSquadrons())

    window.addEventListener("wheel", onScroll)
    window.addEventListener("resize", onResize)

    getParticlesAnimation()

    scrollToTop()

    return () => {
      window.removeEventListener("wheel", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  useEffect(() => {
    const countElements = ref.current.childNodes.length
    setDeployed(countElements >= 1 ? true : false)
  })

  useEffect(() => {
    setStarShips(squadrons)
  }, [squadrons])

  const saveWinner = (id) => {
    try {
      dispatch(updateWinner({ id }))
    } catch (err) {
      console.error("Failed to update the Winner", err)
    }
  }

  const getY = (el) => {
    const speed = el.getAttribute("data-speed")
    const weight = el.getAttribute("data-weight")
    if (speed === 0) return speed
    return 1 - speed / weight
  }

  const addAction = () => {
    if (refSquadrons.current) {
      gsap.utils.toArray("[data-speed]").forEach((el) => {
        gsap.to(el, {
          y: () => getY(el),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "-=800",
            end: "top",
            scrub: false,
          },
        })
      })
    }
    refAction.current = true
  }

  const addColorTo = (id) => {
    if (refSquadrons.current) {
      const sqArray = [...refSquadrons.current.childNodes]
      const el = sqArray[id]
      gsap.set(el, {
        borderBottom:
          "100px solid rgb(random(0,190), random(0,190), random(0,1)",
      })
    }
  }

  const addColorToAll = () => {
    if (refSquadrons.current) {
      gsap.set(".squadron", {
        borderBottom:
          "100px solid rgb(random(0,190), random(0,190), random(0,1)",
      })
    }
  }

  useEffect(() => {
    addColorToAll()
  }, [deployed, starShips])

  const deploySquadrons = () => (
    <div ref={refSquadrons}>
      {starShips.map((el, index) => (
        <Squadron
          key={index}
          fieldWidth={fieldWidth}
          name={
            yourStarShip && yourStarShip.id === index
              ? `${el.name} -> ${yourStarShip.name}`
              : el.name
          }
          speed={el.speed}
          weight={el.weight}
          id={el.squadron_id}
          index={index}
          total={starShips.length}
          sendSquadronToAction={sendSquadronToAction}
        />
      ))}
    </div>
  )

  const sendSquadronToAction = (id, name, speed, type) => {
    setSquadron({ id, name, speed })
    setType(type)
    toggleModal()
  }

  const createNewSquadron = () => {
    setSquadron(null)
    setType("create")
    toggleModal()
  }

  const showWinners = () => {
    dispatch(fetchWinners())
    setType("show")
    toggleModal()
  }

  const assignSquadron = (e) => {
    e.preventDefault()
    const randomId = Math.floor(Math.random() * starShips.length)
    setYourStartShip({ id: randomId, name: `You` })
    addColorTo(randomId)
  }

  const toggleModal = () => {
    setShowModal((prev) => !prev)
  }

  const controlParams = (param, min, max) => {
    let currentParam = Number(param)
    if (param <= min) currentParam = min
    if (param >= max) currentParam = max
    return currentParam
  }

  const handleUpdate = (id, currentSpeed) => {
    const speed = controlParams(currentSpeed, MIN_SPEED, MAX_SPEED)
    try {
      dispatch(updateSquadron({ id, speed }))
    } catch (err) {
      console.error("Failed to update the Squadron", err)
    }
    toggleModal()
    resetActions()
  }

  const handleDelete = (id) => {
    try {
      dispatch(deleteSquadron({ id }))
    } catch (err) {
      console.error("Failed to delete the Squadron", err)
    }
    toggleModal()
    resetActions()
  }

  const handleCreate = ({ name, speed, weight }) => {
    speed = controlParams(speed, MIN_SPEED, MAX_SPEED)
    weight = controlParams(weight, MIN_WEIGHT, MAX_WEIGHT)
    try {
      dispatch(createSquadron({ name, speed, weight }))
    } catch (err) {
      console.error("Failed to create the Squadron", err)
    }
    toggleModal()
    resetActions()
  }

  const handleShow = () => {
    toggleModal()
    dispatch(fetchSquadrons())
    resetActions()
  }

  const playAgain = () => {
    resetActions()
  }

  const resetActions = () => {
    refWinner.current = null
    refAction.current = false
    scrollToTop()
    setStart()
  }

  return (
    <>
      <div ref={refTop}></div>
      <div className={`controls-${showModal}`}>
        <button onClick={(e) => createNewSquadron(e)}>
          Create New Squadron
        </button>
        <button onClick={(e) => showWinners(e)}>Show Winners</button>
        <button onClick={(e) => assignSquadron(e)}>Select Squadron</button>
        <button onClick={(e) => playAgain()}>Play again</button>
      </div>

      {showModal ? (
        <Modal
          className="fade-up"
          text={refWinner.current?.firstChild.innerText}
          type={type}
          squadron={squadron}
          winners={type === "show" ? squadrons : []}
          toggleModal={toggleModal}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          handleCreate={handleCreate}
          handleShow={handleShow}
        />
      ) : null}
      <div className="field" ref={ref}>
        {starShips ? deploySquadrons() : null}
      </div>
      <footer>
        <a className="github" href="https://github.com/dithiane">
          @ 2023 Dithiane
        </a>
      </footer>
    </>
  )
}

export default App
