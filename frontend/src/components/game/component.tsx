import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Popover } from 'antd';
import Board from 'components/game/board';
import { ColourPosition } from 'core/board';
import React, { ReactElement, useState } from 'react';
import Pawn from './pawn';

interface IProps {
    quitGame: () => void;
    startGame: () => void;
    getInviteLink: () => string;
    copyGameLink: () => void;
    game?: IGame;
    player?: IPlayer;
}

const GameComponent = (props: IProps): ReactElement => {
    const [isInviteModalVisible, setInviteModaleVisible] = useState<boolean>(false);
    const [isLinkTooltipVisible, setLinkTooltipVisible] = useState<boolean>(false);

    const quitGame = () => {
        props.quitGame();
    };

    const startGame = () => {
        props.startGame();
    };

    const renderPlayers = (players: IGamePlayer[]): ReactElement[] => {
        return players.map((player: IGamePlayer, index: number) => {
            const classes = ['player'];
            if (props.player && props.player.position === player.position) {
                classes.push('me');
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

    const copyGameLink = () => {
        setLinkTooltipVisible(true);
        props.copyGameLink();
    };

    const getInviteLink = (): string => {
        return props.getInviteLink();
    };

    const closeInviteModale = () => {
        setLinkTooltipVisible(false);
        setTimeout(() => {
            setInviteModaleVisible(false);
        }, 100);
    };

    const openInviteModale = () => {
        setInviteModaleVisible(true);
    };

    const onShowLinkTooltip = () => {
        setTimeout(() => {
            setLinkTooltipVisible(false);
        }, 2000);
    };

    const renderStartAction = (game?: IGame): ReactElement | undefined => {
        return game && game.status === 'CREATED' ? <Button type="primary" size="large" onClick={startGame}>Start game</Button> : undefined;
    };

    return <div className="game">
        <div className="board-container">
            <Board
                currentPlayerPosition={props.game && props.game.currentPlayer}
            />
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
                {renderStartAction(props.game)}

                <Button type="primary" size="large" onClick={openInviteModale}>Invite friend</Button>
                <Button type="primary" danger size="large" onClick={quitGame}>Quit game</Button>
            </div>
        </div>
        <Modal title="Invite friend" visible={isInviteModalVisible} onCancel={closeInviteModale} onOk={closeInviteModale} footer={null}>
            <p>Copy the link below and send it to your friends</p>
            <Input id="copy-link" readOnly value={getInviteLink()} size="large" prefix={<LinkOutlined />} suffix={
                <Popover
                    content="Link copied!"
                    visible={isLinkTooltipVisible}
                    onVisibleChange={onShowLinkTooltip}
                    destroyTooltipOnHide={true}
                >
                    <Button onClick={copyGameLink} icon={<CopyOutlined />}></Button>
                </Popover>
            } />
        </Modal>
    </div>;
};

export default GameComponent;
