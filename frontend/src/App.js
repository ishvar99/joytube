import { BrowserRouter as Router } from "react-router-dom"
import React from "react"
import "./App.scss"
import Routing from "./Components/Routing/Routing"
import Header from "./Components/Header/Header"
import { Provider } from "react-redux"
import store from "./redux/store"
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Header />
          <Routing />
        </Router>
      </div>
    </Provider>
  )
}

export default App
