import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import HomePage from './Pages/HomePage.tsx'
import ListPage from './Pages/ListPage.tsx'

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/grocery-list/sw.js')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter
            basename={
                process.env.NODE_ENV === 'production' ? '/grocery-list' : ''
            }
        >
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<HomePage />} />
                    <Route path="/list/:listName" element={<ListPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
