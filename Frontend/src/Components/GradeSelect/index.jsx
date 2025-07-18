import { MenuItem, Select, Button } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import grades from '../../Assets/Grades'

const GradeSelect = ({ value, label, onChange }) => {
    const mainGrades = ['SS', 'S', 'Ap', 'A']
    const otherGrades = ['SSS', 'Bp', 'Cp', 'Dp', 'B', 'C', 'D', 'F', 'Failed']

    const otherValue = otherGrades.includes(value) ? value : ''

    const handleMoreChange = (e) => {
        onChange(e.target.value)
    }

    return <Wrapper>
        {label && <Label>{label}</Label>}
        <MainButtons>
            {mainGrades.map(g => (
                <GradeButton key={g} $selected={value === g} onClick={() => onChange(g)}>
                    <Grade src={grades[g]} />
                </GradeButton>
            ))}
        </MainButtons>
        <Select
            value={otherValue}
            displayEmpty
            onChange={handleMoreChange}
            renderValue={(selected) => selected ? <Grade src={grades[selected]} /> : 'More'}
        >
            {otherGrades.map(g => <MenuItem key={g} value={g}><Grade src={grades[g]} /></MenuItem>)}
        </Select>
    </Wrapper>
}

export default GradeSelect

const Grade = styled.img`
    height: 30px;
`

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    width: 100%;
`

const Label = styled.span`
    margin-right: 4px;
`

const MainButtons = styled.div`
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
`

const GradeButton = styled(Button)`
    min-width: 0;
    padding: 0;
    border: ${props => props.$selected ? '2px solid #1976d2' : 'none'};
`