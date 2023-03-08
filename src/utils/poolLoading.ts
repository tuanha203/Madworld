export const addToArray = (arr = [], id: number) => {
    if (Number.isInteger(id) && !(arr as any).includes(id)) (arr as any).push(id)
}

export const removeFromArray = (arr = [], id: any) => {
    if (Number.isInteger(id) && (arr as any).includes(id)) {
        const index = arr.findIndex(poolId => poolId === id)
        arr.splice(index, 1)
    }
}
