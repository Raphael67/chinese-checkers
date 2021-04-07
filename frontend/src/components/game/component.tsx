import { Button, Card } from 'antd';
import { ReactElement } from 'react';
import Board from './board';

interface IProps {
    quitGame: () => void;
}

const GameComponent = (props: IProps): ReactElement => {
    const quitGame = () => {
        props.quitGame();
    };

    return <div className="game">
        <div className="board-container">
            <Board />
        </div>
        <div className="info-container">
            <div className="info">
                <Card bordered={false} title="Current game" className="current-game">
                    <p>Round #6</p>
                    <p>Longest streak: 50</p>
                </Card>
                <Card bordered={false} title="Players" className="players">
                    <p>Raph</p>
                    <p>Joe</p>
                    <p>Michou-misalade</p>
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
