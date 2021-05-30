import { Card } from 'antd';
import Board from 'components/game/board';
import Pawn from 'components/game/pawn';
import { ColourPosition } from 'core/board';
import React, { ReactElement, useState } from 'react';

interface IProps {
    game?: IGame;
    player?: IPlayer;
}

const GameStatusMap: {
    [key in IGame['status']]: string
} = {
    STARTED: 'Started',
    CREATED: 'Created',
    FINISHED: 'Finished'
};

const ReplayComponent = (props: IProps): ReactElement => {
    const [playerPlaying, setPlayerPlaying] = useState<number>(0);

    const renderPlayers = (players: IGamePlayer[], playerPlaying: number): ReactElement[] => {
        return players.map((player: IGamePlayer, index: number) => {
            const classes = ['player'];
            if (props.player && props.player.position === player.position) {
                classes.push('me');
            }

            if (playerPlaying === player.position) {
                classes.push('playing');
            }

            const position = player.position;
            return <div data-position={position} className={classes.join(' ')} key={`p${index}`}>
                <Pawn colour={ColourPosition[position || 0]} r={10} alone={true} />
                <div>{player.nickname}</div>
            </div>;
        });
    };

    const renderGameInfo = (game: IGame): ReactElement => {
        return <>
            <p>Round #{game.rounds}</p>
            <p>Longest streak: {game.longestStreak}</p>
        </>;
    };

    return <div className="replay">
        <div className="board-container">
            <Board currentPlayerPosition={props.game && props.game.currentPlayer} setPlayerPlaying={setPlayerPlaying} fromReplay={true} />
        </div>
        <div className="info-container">
            <div className="info">
                <Card bordered={false} title={`Current game (${props.game ? GameStatusMap[props.game.status] : 'Idle'})`} className="current-game">
                    {props.game && renderGameInfo(props.game)}
                </Card>
                <Card bordered={false} title="Players" className="players">
                    {props.game && renderPlayers(props.game.players || [], playerPlaying)}
                </Card>
            </div>
        </div>

    </div>;
};

export default ReplayComponent;
