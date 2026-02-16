import React, { useEffect, useState, useRef } from "react";
import { GridHelper } from "./gridHelper";

export const Grid = ({height = 10, width = 10}) => {
    const [gridState, setgridState] = useState<boolean[][]>([]);
    const pauseRef = useRef(true);

    useEffect(() => {
        setgridState(() => {
            const init: boolean[][] = [];

            for (let row = 0; row < height; row ++) {
                init.push([]);
                for (let col= 0; col < width; col ++) {
                    init[row].push(false);
                }
            }

            return init;
        });
    }, []);

    const getSquareDetails = async (row: number, col: number) => {
        let aliveCount = 0;
        let deadCount = 0;

        const toUse = gridState;

        for (let rowDiff = -1; rowDiff < 2; rowDiff++) {
            for (let colDiff = -1; colDiff < 2; colDiff++) {
                if (rowDiff === 0 && colDiff === 0) {
                    continue;
                }

                const rowCheck = row + rowDiff;
                const colCheck = col + colDiff;

                if (rowCheck >= 0 && rowCheck < height && colCheck >= 0 && colCheck < width) {
                    const toCheck = toUse[rowCheck][colCheck];

                    if (toCheck) {
                        aliveCount++;
                    } else {
                        deadCount++;
                    }
                }
            }
        }

        return {
            aliveCount: aliveCount,
            deadCount: deadCount
        }
    }

    const handleSet = (row: number, col: number) => {
        // no update when running sorry not sorry.
        if (!pauseRef.current) {
            return;
        }

        const updated = gridState.map((x, row2) => {
            return x.map((val, col2) => {
                if (row === row2 && col === col2) {
                    return !val;
                }

                return val
            })
        });
        setgridState(updated);
    }

    const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


    const doFrame = async (holdOff: number = 0) => {
        const start = Date.now();
        const states = await Promise.all(gridState.map(async (rowVals, row) => {
            return await Promise.all(rowVals.map(async (value, col) => {
                const {aliveCount, deadCount} = await getSquareDetails(row, col);

                if (aliveCount <= 1) {
                    return false;
                }

                if (aliveCount >= 4) {
                    return false;
                }

                if (value && (aliveCount === 2 || aliveCount === 3)) {
                    return true;
                }

                if (!value && (aliveCount === 3)) {
                    return true;
                }

                // when dead and 2 alive, 6 dead?
                return false;
            }));
        }));

        const diff = Date.now() - start;
        await delay(holdOff ? holdOff - diff : 0);
        setgridState(old => states);
    }

    // react doesnt do loops well with state
    // "loop" on state change itself
    useEffect(() => {
        if (!pauseRef.current) {
            doFrame(150); // that feels good
        }
    }, [gridState])



    return <>
        <GridHelper gs={gridState} setter={handleSet}/>
        <button onClick={() => doFrame}>next frame</button>
        <button onClick={() => {
            pauseRef.current = false;
            doFrame();
        }}>Play</button>
        <button onClick={() => {
            pauseRef.current = true;
        }}>Pause</button>
    </>
}