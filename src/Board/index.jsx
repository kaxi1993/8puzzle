import React, { Component } from 'react'
import _ from 'lodash'

import Tile from '../Tile'

// import predefined 8 puzzle positions, which takes small time to resolve 
import startPositions from './positions'

import './Board.css'

class Board extends Component {
    constructor (props) {
        super(props)

        this.state = {
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 0]
        }
    }

    componentDidMount () {
        // const start = this.shuffle(this.state.numbers) // uncomment this line and comment line below, if you want to use starting position randomly
        const start = _.sample(startPositions) // take starting position from predefined positions
        const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0]

        this.setState({
            numbers: start
        })

        const fullPath = this.aStar(start, goal)

        this.draw(fullPath)
    }

    /**
     * Shuffle numbers
     * 
     * @param {[Number]} numbers from 0 to 8 
     * @returns {[Number]} in random order
     */
    shuffle (numbers) {
        let shuffledNumbers = _.shuffle(numbers)

        // shuffle numbers until their position is solvable
        while (!this.isSolvable(shuffledNumbers)) {
            shuffledNumbers = _.shuffle(numbers)
        }

        return shuffledNumbers
    }

    /**
     * Check if numbers position is solvable
     * 
     * @param {[Number]} numbers shuffled numbers
     * @returns {Boolean}
     */
    isSolvable (numbers) {
        let count = 0

        for (let i = 0; i < 8; i++) {
            for (let j = i + 1; j <= 8; j++) {
                if (numbers[i] && numbers[j] && numbers[i] > numbers[j]) {
                    count++
                }
            }
        }

        return count % 2 === 0
    }

    /**
     * A* algorithm implementation, returns full path
     * from starting position to goal position
     * 
     * @param {[Number]} start position of numbers
     * @param {[Number]} goal position of numbers
     * @returns {[[Number]]} array of numbers array
     */
    aStar (start, goal) {
        const closedSet = []

        const openSet = [start]

        const fScores = {}
        const gScores = {}

        gScores[start] = 0
        fScores[start] = this.getHeuristic(start, goal)

        const cameFrom = {}

        while (openSet.length > 0) {
            const current = this.getLowestFscore(openSet, fScores)

            if (this.isEqual(current, goal)) {
                const fullPath = this.reconstructPath(cameFrom, current)

                return fullPath
            }

            // remove current position from open set
            _.remove(openSet, (position) => this.isEqual(position, current))

            // add current position to closed set
            closedSet.push(current)

            const neighbors = this.getNeighbors(current)

            for (let neighbor of neighbors) {
                if (this.isInSet(closedSet, neighbor)) {
                    continue
                }

                const tentativeGscore = gScores[current] + 1 // dist between current and neighbor is one

                if (!this.isInSet(openSet, neighbor)) {
                    openSet.push(neighbor)
                } else if (tentativeGscore >= gScores[neighbor]) {
                    continue
                }

                cameFrom[neighbor] = current
                gScores[neighbor] = tentativeGscore
                fScores[neighbor] = gScores[neighbor] + this.getHeuristic(neighbor, goal)
            }
        }
    }

    /**
     * Get position with lowest fScore
     * 
     * @param {[[Number]]} openSet array of open positions 
     * @param {[Number]} fScores array of fscores
     * @returns {[Number]}
     */
    getLowestFscore (openSet, fScores) {
        let minFscore = openSet[0]
        let minScore = fScores[minFscore]

        openSet.forEach(item => {
            if (fScores[item] < minScore) {
                minScore = fScores[item]
                minFscore = item
            }
        })

        return JSON.parse("[" + minFscore + "]")
    }

    /**
     * Compare if two positions are equal
     * 
     * @param {[Number]} current position of numbers
     * @param {[Number]} goal position of numbers
     * @returns {Boolean}
     */
    isEqual (current, goal) {
        return current.toString() === goal.toString()
    }

    /**
     * Get neighbor positions of current position
     * 
     * @param {[Number]} current position of numbers
     * @returns {[[Number]]} 
     */
    getNeighbors (current) {
        const positions = []
        const idx = current.findIndex(item => item === 0)

        const emptyChunkIndex = Math.floor(idx / 3)
        const emptyIndex = idx - emptyChunkIndex * 3

        if (idx - 3 >= 0) {
            const newNumbers = [...current]

            newNumbers[idx] = current[idx - 3]
            newNumbers[idx - 3] = 0

            positions.push([...newNumbers])
        }

        if (idx + 3 <= 8) {
            const newNumbers = [...current]

            newNumbers[idx] = current[idx + 3]
            newNumbers[idx + 3] = 0

            positions.push([...newNumbers])
        }

        if (emptyIndex - 1 >= 0) {
            const newNumbers = [...current]

            newNumbers[idx] = current[idx - 1]
            newNumbers[idx - 1] = 0

            positions.push([...newNumbers])
        }

        if (emptyIndex + 1 <= 2) {
            const newNumbers = [...current]

            newNumbers[idx] = current[idx + 1]
            newNumbers[idx + 1] = 0

            positions.push([...newNumbers])
        }

        return positions
    }

    /**
     * Check if position is in set(open or closed) already
     * 
     * @param {[[Number]]} set array of numbers position
     * @param {[Number]} neighbor position of numbers
     * @returns {Boolean}
     */
    isInSet (set, neighbor) {
        return !!set.find(position => this.isEqual(position, neighbor))
    }

    /**
     * Get heuristic cost
     * 
     * @param {[Number]} current position of numbers
     * @param {[Number]} goal position of numbers
     * @returns {Number}
     */
    getHeuristic (current, goal) {
        let count = 0

        for (let i = 0; i < current.length; i++) {
            if (current[i] !== 0 && current[i] !== goal[i]) {
                count++
            }
        }

        return count
    }

    /**
     * Get successfull path from full path covered
     * 
     * @param {Object} cameFrom full path covered
     * @param {[Number]} current goal position
     * @returns {[[Number]]}
     */
    reconstructPath (cameFrom, current) {
        const totalPath = [current]

        while (Object.keys(cameFrom).includes(current.toString())) {
            current = cameFrom[current]

            totalPath.push(current)
        }

        return _.reverse(totalPath)
    }

    /**
     * Draw iteration from start to goal position
     * wait 700 ms at each step and then draw next position
     * 
     * @param {[[Number]]} fullPath array of numbers
     * @param {Number} i iteration count
     */
    draw (fullPath, i = 0) {
        if (i >= fullPath.length) {
            return
        }

        this.setState({
            numbers: fullPath[i]
        })

        setTimeout(() => {
            this.draw(fullPath, ++i)
        }, 700)
    }

    render () {
        const { numbers } = this.state
        const tiles = numbers.map(item => <Tile key={item} number={item} />)

        return (
            <div className="board">
                {tiles}
            </div>
        )
    }
}

export default Board
