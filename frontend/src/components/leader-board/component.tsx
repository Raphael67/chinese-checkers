import { CaretRightOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Form, Input, Layout, List, Radio } from 'antd';
import React, { ReactElement } from 'react';
import { Colour } from '../game/board';
import Pawn from '../game/pawn';
import './index.less';

interface IProps {
    newGame: () => void;
    topPlayers: IPlayer[];
    gamesPlayed: IGame[];
}

const { Sider, Content } = Layout;

enum Sort {
    Date,
    NumberOfRounds
}

const LeaderBoardComponent = (props: IProps): ReactElement => {
    const newGame = () => {
        props.newGame();
    };

    const renderTopPlayer = (player: IPlayer, index: number): ReactElement => {
        return <List.Item key={`player${index}`} className="top-player">
            <div className="place-number">{index + 1}</div>
            <div className="player-name">{player.name}</div>
        </List.Item>;
    };

    const renderGamePlayers = (players: IPlayer[]): ReactElement[] => {
        return players.map((player: IPlayer, index: number) => {
            return <div key={`game_player${index}`}>
                <Pawn colour={player.colour || Colour.Black} r={10} alone={true} />
                <div className="game-player-name">{player.name}</div>
            </div>;
        });
    };

    const renderGamePlayed = (game: IGame, index: number): ReactElement => {
        return <List.Item key={`game${index}`}>
            <div className="game-players">{renderGamePlayers(game.players)}</div>
            <div>Played on {game.date.toUTCString()}</div>
            <Button className="play-game-action" size="large" icon={<CaretRightOutlined />} />

        </List.Item>;
    };

    const renderTopPlayers = (players: IPlayer[]): ReactElement => {
        return players.length > 0 ? <List dataSource={players} renderItem={renderTopPlayer} /> : <Empty />;
    };

    const renderGamesPlayed = (games: IGame[]): ReactElement => {
        return games.length > 0 ? <List size="large" dataSource={games} renderItem={renderGamePlayed} /> : <Empty />;
    };

    return <div className="leader-board">
        <Sider className="leader-board-container">
            <Card className="board-list" bordered={false} title="Leader board">
                {renderTopPlayers(props.topPlayers)}
            </Card>
            <Button type="primary" size="large" className="new-game-action" onClick={newGame}>New game</Button>
        </Sider>
        <Content className="games">
            <Card className="games-list" bordered={false} title="Games played">
                <Form className="search-form" layout="inline">
                    <Form.Item label="Player">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Date">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Sort">
                        <Radio.Group>
                            <Radio value={Sort.Date}>
                                Date
                            </Radio>
                            <Radio value={Sort.NumberOfRounds}>
                                Number of rounds
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary">Search</Button>
                    </Form.Item>
                </Form>
                {renderGamesPlayed(props.gamesPlayed)}
            </Card>
        </Content>
    </div>;
};

export default LeaderBoardComponent;
