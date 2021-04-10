import { Button, Card } from 'antd';
import Board from 'components/game/board';
import React, { ReactElement } from 'react';

interface IProps {
    quitGame: () => void;
    game?: IGame;
}

const GameComponent = (props: IProps): ReactElement => {
    const quitGame = () => {
        props.quitGame();
    };

    const renderPlayers = (players: IGamePlayer[]): ReactElement[] => {
        return players.map((player: IGamePlayer) => <p>{player.nickname}</p>);
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
                    {props.game && renderPlayers(props.game.gamePlayers || [])}
                </Card>
            </div>
            <div className="actions">
                <Button type="primary" size="large">Start game</Button>
                <Button type="primary" size="large">Invite friend</Button>
                <Button type="primary" danger size="large" onClick={quitGame}>Quit game</Button>
            </div>
        </div>
    </div>;
};

export default GameComponent;
