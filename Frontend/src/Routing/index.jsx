import React, { useEffect } from 'react'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"
import Layout from '../Components/Layout'
import Songs from '../Pages/Songs'
// import { useDispatch, useSelector } from 'react-redux'
import Login from '../Pages/Login'

const router = createBrowserRouter([
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
                path: 'Scores',
                element: <div>scores</div>
            },
            {
                path: 'Leaderboard',
                element: <div>lb</div>
            },
            {
                path: 'add',
                element: <div>add</div>
            },
            {
                path: 'profile/:id',
                element: <div>user profile</div>
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