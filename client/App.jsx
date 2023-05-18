import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSquadrons, selectData } from "./src/services/squadrons"
import { gsap } from "gsap"
import Squadron from "./src/components/Squadron"
gsap.registerPlugin(ScrollTrigger)

const App = () => {
  const [starShips, setStarShips] = useState(null)
  const dispatch = useDispatch()
  const squadrons = useSelector(selectData)
  let parentNode = null

  useEffect(() => {
    setStarShips(squadrons)
  }, [squadrons])

  useEffect(() => {
    if (parentNode.children.length > 1) deploySquadrons()
  }, [parentNode])

  const handleClick = async (e) => {
    e.preventDefault()
    dispatch(fetchSquadrons())
  }

  const deploySquadrons = () => {
    gsap.set(".squadron", {
      borderBottom: "100px solid rgb(random(0,190), random(0,190), random(0,1)",
    })
    gsap.utils.toArray("[data-speed]").forEach((el) => {
      gsap.to(el, {
        y: () => {
          let pathY =
            (1 - parseFloat(el.getAttribute("data-speed"))) *
            (ScrollTrigger.maxScroll(window) -
              (this.scrollTrigger ? this.scrollTrigger.start : 0))
          //TO DO showWinner(el.getAttribute("id"))
          return pathY
        },
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top center",
          end: "max",
          invalidateOnRefresh: true,
          scrub: true,
        },
      })
    })
  }
  return (
    <div className="field" ref={(el) => (parentNode = el)}>
      <button onClick={handleClick}>Start</button>
      {starShips?.map((el, id) => (
        <Squadron key={id} name={el.name} speed={el.speed} id={id} />
      ))}
    </div>
  )
}

export default App
