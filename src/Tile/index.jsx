import React from 'react'

import './Tile.css'

function Tile (props) {
    const { number } = props

    if (number === 0) {
        return <div className="tile tile--empty"></div>
    }

    return (
        <div className="tile">
            {number}
        </div>
    )
}

export default Tile
