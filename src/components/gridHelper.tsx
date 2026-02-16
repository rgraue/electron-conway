import React from "react";

export const GridHelper = ({gs, setter}: {gs: boolean[][], setter: any}) => {

    const renderRow = (row: number) => {
        return gs[row].map((val, col) => {
            return <div 
                style={{
                    height:'15px', 
                    width: '15px',
                    borderWidth: '1px',
                    borderColor: 'black',
                    borderStyle: 'solid',
                    backgroundColor: val ? 'black' : 'white',
                    cursor: 'pointer'
                }}
                onClick={() => setter(row, col)}
                key={`${row},${col}`}
            />
        })
    }

    return <>
        {
        gs.map((_, i) => {
            return <div style={{ display: 'flex'}} key={`${i}`}>{renderRow(i)}</div>
        })}
    </>
}