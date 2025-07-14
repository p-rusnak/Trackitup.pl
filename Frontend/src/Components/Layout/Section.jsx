import { Box, Divider } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { styled as styled2 } from '@mui/system';

const Section = ({ header, children }) => {
    return (
        <SectionBlock
            sx={{
                width: {
                    sx: '100%'
                }
            }}>
            <Header>
                {header}
            </Header>
            <Divider variant="middle" />
            <br/>
            <Content>
                {children}
            </Content>
        </SectionBlock>
    )
}

export default Section

const SectionBlock = styled2(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: '15px',
    borderLeft: '2px solid #1976d2',
    bordeRadius: '10px',
    marginBottom: '25px'
}));

const Header = styled.h2`
    
`

const Content = styled.div`
    display: flex;
    justify-content: space-around;
    overflow-x: auto;
`