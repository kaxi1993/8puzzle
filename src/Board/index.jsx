import React, { Component } from 'react'
import _ from 'lodash'

import Tile from '../Tile'

import './Board.css'

class Board extends Component {
    constructor (props) {
        super(props)

        this.state = {
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 0]
        }
    }

    componentDidMount () {
        const start = [1, 5, 8, 0, 7, 3, 6, 4, 2]
        // const start = _.shuffle(this.state.numbers)
        const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0]

        this.setState({
            numbers: start
        })

        setTimeout(() => {
            this.aStar(start, goal)
        }, 1000)
    }

    aStar (start, goal) {
        let openSet = [start]
        const closedSet = []

        const gScores = {}
        const fScores = {}

        gScores[start] = 0
        fScores[start] = this.getHeuristic(start, goal)

        const cameFrom = {}

        let count = 0

        while (openSet.length > 0 && ++count < 5000) {
            const current = this.getLowestFscore(openSet, fScores)
            console.log('current', current, count)

            if (this.isEqual(current, goal)) {
                const fullPath = _.reverse(this.reconstructPath(cameFrom, current))

                this.draw(fullPath)

                return true
            }

            // remove current position from open set
            openSet = this.remove(openSet, current)

            // add current position to closed set
            closedSet.push(current)

            const neighbors = this.getNeighbors(current)

            for (let neighbor of neighbors) {
                if (this.isInSet(closedSet, neighbor)) {
                    continue
                }

                const tentativeGscore = gScores[current] + 1 // dist_between(current, neighbor) is one

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

    draw (fullPath, i = 0) {
        if (i >= fullPath.length) {
            return
        }

        this.setState({
            numbers: fullPath[i]
        })

        setTimeout(() => {
            this.draw(fullPath, ++i)
        }, 1000)
    }

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

    isEqual (current, goal) {
        return JSON.stringify(current) === JSON.stringify(goal)
    }

    remove (openSet, current) {
        return openSet.filter(position => !this.isEqual(position, current))
    }

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

    isInSet (set, neighbor) {
        return !!set.find(position => this.isEqual(position, neighbor))
    }

    getHeuristic (current, goal) {
        let count = 0

        for (let i = 0; i < current.length; i++) {
            if (current[i] !== 0 && current[i] !== goal[i]) {
                count++
            }
        }

        return count
    }

    reconstructPath (cameFrom, current) {
        const totalPath = [current]

        while (Object.keys(cameFrom).includes(current.toString())) {
            current = cameFrom[current]

            totalPath.push(current)
        }

        return totalPath
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
