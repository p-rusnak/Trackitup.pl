import React, { useEffect } from 'react'
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom"
import Layout from '../Components/Layout'
import Songs from '../Pages/Songs'
import SongPage from '../Pages/Songs/SongPage'
import Scores from '../Pages/Scores'
import AllScores from '../Pages/Scores/All'
import Leaderboard from '../Pages/Leaderboard'
import Titles from '../Pages/Titles'
import SessionPage from '../Pages/Session'
import SessionsPage from '../Pages/Sessions'
import AllSessions from '../Pages/Sessions/All'
import AddScore from '../Pages/AddScore'
// import { useDispatch, useSelector } from 'react-redux'
import Login from '../Pages/Login'
import Profile from '../Pages/Profile'

const router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Songs mode='item_single' />
            },
            {
                path: 'Single',
                element: <Songs mode='item_single' />
            },
            {
                path: 'Double',
                element: <Songs mode='item_double'/>
            },
            {
                path: 'Coop',
                element: <Songs mode='item_coop'/>
            },
            {
                path: 'Scores',
                element: <Scores />
            },
            {
                path: 'ScoresAll',
                element: <AllScores />
            },
            {
                path: 'SessionsAll',
                element: <AllSessions />
            },
            {
                path: 'session',
                element: <SessionPage />
            },
            {
                path: 'session/:id',
                element: <SessionPage />
            },
            {
                path: 'sessions/:userId',
                element: <SessionsPage />
            },
            {
                path: 'Leaderboard',
                element: <Leaderboard />
            },
            {
                path: 'Titles',
                element: <Titles />
            },
            {
                path: 'song/:id/:mode/:diff',
                element: <SongPage />
            },
            {
                path: 'add',
                element: <AddScore />
            },
            {
                path: 'profile/:id',
                element: <Profile />
            },
            {
                path: 'login',
                element: <Login/>
            },
        ],
    },
  ])

const Router = () => {
    // const dispatch = useDispatch()
    // const user = useSelector(state => state.user)

    useEffect(() => {
    }, [])

    return (
        <React.StrictMode>
                <RouterProvider router={router} />
        </React.StrictMode>
    )
  
}

export default Router
