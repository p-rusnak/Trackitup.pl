import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ApiClient } from '../../API/httpService'

const apiClient = new ApiClient()

const BlockPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        apiClient.login({
            email,
            password,
        }).then(response => {
            localStorage.setItem('token', response.data.tokens.access.token);
            window.location.reload();
        })
    }

    return (
        <Container>
            <Box>
                <Header>
                    Strona w budowie.
                </Header>
                <TextField
                    id="outlined-password-input"
                    label="Email"
                    type="text"
                    autoComplete="current-password"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" onClick={handleLogin}>Zaloguj</Button>
            </Box>
        </Container>
    )
}

export default BlockPage 

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    background-color: gray;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Header = styled.h2`
width: 100%;`

const Box = styled.div`
    border-radius: 10px;
    padding: 50px;
    width: 20%;
    background-color: white;
`