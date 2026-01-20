import { createRoot } from 'react-dom/client'
import './index.css'

import { App } from './pages/App.tsx'
import { History } from './pages/History.tsx'

import { GameProvider } from './context/game-context.tsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

createRoot(document.getElementById('root')!).render(
    <Router>
        <div className='h-svh flex flex-col justify-center items-center p-6 overflow-hidden bg-zinc-100'>
            <GameProvider>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/history" element={<History />} />
                </Routes>
            </GameProvider>
        </div>
    </Router>
)
