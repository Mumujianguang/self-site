import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/Home'
import "@radix-ui/themes/styles.css";
import './App.less'
import { Theme } from '@radix-ui/themes';

function App() {
    return (
        <Theme appearance='dark' style={{ height: '100%'}}>
            <Router>
                <div className='app'>
                    <Home />
                </div>
            </Router>
        </Theme>
    )
}

export default App