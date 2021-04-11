import { Button, Card } from 'antd';
import Board from 'components/game/board';
import { Colour } from 'core/board';
import React, { ReactElement } from 'react';
import Pawn from './pawn';

interface IProps {
    quitGame: () => void;
    startGame: () => void;
    game?: IGame;
    player?: IPlayer;
}

const GameComponent = (props: IProps): ReactElement => {
    const quitGame = () => {
        props.quitGame();
    };

    const startGame = () => {
        props.startGame();
    };

    const renderPlayers = (players: IGamePlayer[]): ReactElement[] => {
        return players.map((player: IGamePlayer, index: number) => {
            return <div className={`player ${props.player && props.player.colour === player.colour ? 'me' : ''}`} key={`p${index}`}>
                <Pawn colour={player.colour || Colour.Black} r={10} alone={true} />
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

    return <div className="game">
        <div className="board-container">
            <Board />
        </div>
        <div className="info-container">
            <div className="info">
                <Card bordered={false} title="Current game" className="current-game">
                    {props.game && renderGameInfo(props.game)}
                </Card>
                <Card bordered={false} title="Players" className="players">
                    {props.game && renderPlayers(props.game.players || [])}
                </Card>
            </div>
            <div className="actions">
                <Button type="primary" size="large" onClick={startGame}>Start game</Button>
                <Button type="primary" size="large">Invite friend</Button>
                <Button type="primary" danger size="large" onClick={quitGame}>Quit game</Button>
            </div>
        </div>
    </div>;
};

export default GameComponent;
