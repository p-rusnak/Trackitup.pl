const gradeOrder = ['SSS', 'SS', 'S', 'Ap', 'A', "Bp", "B", "Cp", 'C', "Dp", "D", "F"]

const compareGrades = (a, b) => {
    if (!b) return -1
    if (!a) return 1
    if (gradeOrder.findIndex(x => x === a) > gradeOrder.findIndex(x => x === b)) return 1
    if (gradeOrder.findIndex(x => x === a) === gradeOrder.findIndex(x => x === b)) return 0
    if (gradeOrder.findIndex(x => x === a) < gradeOrder.findIndex(x => x === b)) return -1
}

export default compareGrades