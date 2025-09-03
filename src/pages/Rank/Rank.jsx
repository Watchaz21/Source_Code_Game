import React from 'react'
import { isStreamScreen } from 'playroomkit'
import RankMobile from './RankMobile/RankMobile'
import RankDesktop from './RankDesktop/RankDesktop'

const Rank = () => {

    return (
        <div>
            {isStreamScreen() ? (
                <RankDesktop />
            ) : (
                <RankMobile />
            )}
        </div>
    )
}

export default Rank