import React, { Component } from 'react'
// import _ from 'lodash'

import Tile from '../Tile'

import './Board.css'

class Board extends Component {
    constructor (props) {
        super(props)

        this.state = {
            // numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            coordinates: []
        }
    }

    componentDidMount () {

    }

    render () {
        // const tiles = _.shuffle(this.state.numbers).map(item => <Tile number={item} />)
        const tiles = this.state.numbers.map(item => <Tile key={item} number={item} />)

        return (
            <div className="board">
                {tiles}
            </div>
        )
    }
}

export default Board
