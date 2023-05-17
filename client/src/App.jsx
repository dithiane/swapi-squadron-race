import React from "react"
import "./style/App.css"
import { StartButton } from "./components/Button"
import { SpacePaper } from "./components/SpacePaper"

const App = () => {
  const getSquadrons = () => {
    axios.get("/api/squadrons").then(({ data: { wins, losses } }) => {
      winsText.textContent = `Wins: ${wins}`
      lossesTest.textContent = `Losses: ${losses}`
    })
  }
  const handleClick = (e) => {
    console.log(e)
  }
  return (
    <SpacePaper>
      Test
      <StartButton variant="text" onClick={handleClick}>
        Text
      </StartButton>
    </SpacePaper>
  )
}

export default App
