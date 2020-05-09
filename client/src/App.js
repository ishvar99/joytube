import React from 'react'
import {BrowserRouter as Router,Switch ,Route} from 'react-router-dom'
import './App.css';
import {Home,About,Login} from './components/index'
function App() {
  return (
    <div>
    <Router>
      <Switch>
    <Route path="/about" component={About}/>
    <Route path="/login" component={Login}/>
    <Route path="/" component={Home}/>
    </Switch>
    </Router>
    </div>
  );
}

export default App;
