import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/Home'
import './App.less'

function App() {
    return (
        <Router>
            <div className='app'>
                <Home />
            </div>
        </Router>
        
    )
}

export default App
