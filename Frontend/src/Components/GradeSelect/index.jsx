import { MenuItem, Select } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import grades from '../../Assets/Grades'

const GradeSelect = ({ value, label, onChange }) => {
    const mainGrades = ['SS', 'S', 'Ap', 'A']
    const otherGrades = ['SSS', 'Bp', 'Cp', 'Dp', 'B', 'C', 'D', 'F']

    const mainValue = mainGrades.includes(value) ? value : ''
    const otherValue = otherGrades.includes(value) ? value : ''

    return <Wrapper>
        <Select
            value={mainValue}
            label={label}
            displayEmpty
            onChange={onChange}
            renderValue={(selected) => selected ? <Grade src={grades[selected]} /> : label}
        >
            {mainGrades.map(g => <MenuItem key={g} value={g}><Grade src={grades[g]} /></MenuItem>)}
        </Select>
        <Select
            value={otherValue}
            displayEmpty
            onChange={onChange}
            renderValue={(selected) => selected ? <Grade src={grades[selected]} /> : 'More'}
        >
            {otherGrades.map(g => <MenuItem key={g} value={g}><Grade src={grades[g]} /></MenuItem>)}
        </Select>
    </Wrapper>
}

export default GradeSelect

const Grade = styled.img`
    height: 35px;
`

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`