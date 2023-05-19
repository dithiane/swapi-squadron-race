import React, { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSquadrons, selectData } from "./src/services/squadrons"
import { gsap } from "gsap"
import Modal from "./src/components/Portal"
import Squadron from "./src/components/Squadron"
gsap.registerPlugin(ScrollTrigger)
const SCROLL_FINISH = 320
const ACCELERATION_TO_FINISH = 200

const App = () => {
  const [starShips, setStarShips] = useState(null)
  const [deployed, setDeployed] = useState(false)
  const [winner, setWinner] = useState(null)
  const [showModal, setShowModal] = useState(true)

  const dispatch = useDispatch()
  const squadrons = useSelector(selectData)
  const ref = useRef(null)
  const refSquadrons = useRef(null)

  const onScroll = () => {
    if (refSquadrons.current && !winner) {
      let sqArray = [...refSquadrons.current.childNodes]
      sqArray.some((el) => {
        let currentY = parseFloat(String(el.style.transform).split(",")[1])
        let checkFinish =
          window.pageYOffset > SCROLL_FINISH &&
          window.pageYOffset + currentY < ACCELERATION_TO_FINISH
        if (checkFinish) {
          setWinner(el.firstChild.data)
        }
        return Boolean(checkFinish)
      })
    }
  }

  useEffect(() => {
    if (winner) setShowModal(true)
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
      (2 * el.getAttribute("data-accel"))) *
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
          },
        })
      })
    }
  }, [deployed])
  const deploySquadrons = () => (
    <div ref={refSquadrons}>
      {starShips.map((el, index) => (
        <Squadron
          key={index}
          name={el.name}
          speed={el.speed}
          accel={el.acceleration}
          id={el.squadron_id}
          index={index}
          total={starShips.length}
          saveWinner={saveWinner}
        />
      ))}
    </div>
  )

  useEffect(() => {
    if (!showModal && !winner) dispatch(fetchSquadrons())
  }, [showModal])

  return (
    <>
      {showModal ? (
        <Modal
          className="fade-up"
          text={winner}
          type={winner ? "info" : "action"}
          toggleModal={setShowModal}
          saveWinner={saveWinner}
        />
      ) : null}
      <div className="field" ref={ref}>
        {starShips ? deploySquadrons() : null}
      </div>
    </>
  )
}

export default App
