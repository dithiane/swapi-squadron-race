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

  const dispatch = useDispatch()
  const squadrons = useSelector(selectData)
  const ref = useRef(null)
  const refSquadrons = useRef(null)
  const refTop = useRef(null)
  const refWinner = useRef(null)

  const deleteWinner = (el) => {
    el.parentElement.removeChild(el)
  }

  const pushWinner = (el) => {
    refWinner.current = el
    setType("info")
    toggleModal()
    //saveWinner(el.id)
    deleteWinner(el)
  }

  // const onScroll = () => {
  //   if (refSquadrons.current && !refWinner.current) {
  //     let sqArray = [...refSquadrons.current.childNodes]
  //     sqArray.some((el) => {
  //       if (!ScrollTrigger.isInViewport(el, 0.2)) {
  //         setOutViewPort(el)
  //         return true
  //       }
  //     })
  //   }
  // }

  const scrollToTop = () => {
    refTop.current?.scrollIntoView({ behavior: "smooth" })
  }

  const onWheel = (e) => {
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

  useEffect(() => {
    //window.addEventListener("scroll", onScroll)
    window.addEventListener("wheel", onWheel)

    scrollToTop()

    return () => {
      //window.removeEventListener("scroll", onScroll)
      window.removeEventListener("onWheel", onWheel)
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

  const getY = (el) =>
    1 -
    parseFloat(el.getAttribute("data-speed")) /
      parseFloat(el.getAttribute("data-weight"))

  const addAction = () => {
    if (refSquadrons.current) {
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
            // onUpdate: (self) => {
            //   if (self.direction === 1 && outViewPort) pushWinner(outViewPort)
            // },
          },
        })
      })
    }
  }
  useEffect(() => {
    addAction()
  }, [deployed, starShips])

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
    if (!showModal && !refWinner.current) dispatch(fetchSquadrons())
    // if (!showModal) {
    //   if (refWinner.current) refWinner.current = null
    //   else dispatch(fetchSquadrons())
    // }
  }, [showModal])

  const callSquadron = (id, name, speed, type) => {
    setSquadron({ id, name, speed })
    setType(type)
    toggleModal()
  }

  const toggleModal = () => {
    setShowModal((prev) => !prev)
  }

  const handleDelete = (id) => {
    try {
      dispatch(deleteSquadron({ id }))
    } catch (err) {
      console.error("Failed to delete the Squadron", err)
    }
    toggleModal()
    addAction()
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
    addAction()
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
    addAction()
  }

  const assignSquadron = (e) => {
    e.preventDefault()
    const randomId = Math.floor(Math.random() * starShips.length)
    setYourStartShip({ id: randomId, name: `You` })
  }

  const createNewSquadron = () => {
    setType("create")
    setSquadron(null)
    toggleModal()
  }

  const showWinners = () => {
    dispatch(fetchWinners())
    setType("show")
    toggleModal()
    addAction()
  }

  const handleShow = () => {
    toggleModal()
    dispatch(fetchSquadrons())
    addAction()
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
    </>
  )
}

export default App
