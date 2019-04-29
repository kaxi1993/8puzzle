import React, { Component } from 'react'

import './Tile.css'

class Tile extends Component {
    constructor (props) {
        super(props)

        this.state = {
        }
    }

    render () {
        const {number} = this.props

        if (number === 0) {
            return <div className="tile tile--empty"></div>
        }

        return (
            <div className="tile">
                {this.props.number}
            </div>
        )
    }
}

export default Tile
