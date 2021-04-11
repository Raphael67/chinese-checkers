import { CaretRightOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Empty, Form, Input, Layout, List, Radio } from 'antd';
import Pawn from 'components/game/pawn';
import { Colour } from 'core/board';
import React, { ReactElement } from 'react';
import './index.less';

interface IProps {
    createGame: () => void;
    topPlayers: IPlayer[];
    gamesPlayed: IGame[];
    onSearch: (values: ISearchGameParams) => void;
    replayGame: (id: string) => void;
}

const { Sider, Content } = Layout;

const LeaderBoardComponent = (props: IProps): ReactElement => {
    const createGame = () => {
        props.createGame();
    };

    const renderTopPlayer = (player: IPlayer, index: number): ReactElement => {
        return <List.Item key={`player${index}`} className="top-player">
            <div className="place-number">{index + 1}</div>
            <div className="player-name">{player.nickname}</div>
        </List.Item>;
    };

    const renderGamePlayers = (players: IPlayer[]): ReactElement[] => {
        return players.map((player: IPlayer, index: number) => {
            return <div key={`game_player${index}`}>
                <Pawn colour={player.colour || Colour.Black} r={10} alone={true} />
                <div className="game-player-name">{player.nickname}</div>
            </div>;
        });
    };

    const renderGamePlayed = (game: IGame, index: number): ReactElement => {
        return <List.Item key={`game${index}`}>
            <div>
                <div className="game-info">
                    <div>Played on: <strong>{game.createdAt.toUTCString()}</strong></div>
                    <div>Number of rounds: <strong>{game.rounds}</strong></div>
                </div>
                <div className="game-players">{renderGamePlayers(game.players || [])}</div>
            </div>
            <Button onClick={() => props.replayGame(game.id)} className="play-game-action" size="large" icon={<CaretRightOutlined />} />

        </List.Item>;
    };

    const renderTopPlayers = (players: IPlayer[]): ReactElement => {
        return players.length > 0 ? <List dataSource={players} renderItem={renderTopPlayer} /> : <Empty className="empty" />;
    };

    const renderGamesPlayed = (games: IGame[]): ReactElement => {
        return games.length > 0 ? <List size="large" dataSource={games} renderItem={renderGamePlayed} /> : <Empty />;
    };

    const onSearch = (values: ISearchGameParams) => {
        props.onSearch(values);
    };

    return <div className="leader-board">
        <Sider className="leader-board-container">
            <Card className="board-list" bordered={false} title="Leader board">
                {renderTopPlayers(props.topPlayers)}
            </Card>
            <Button type="primary" size="large" className="new-game-action" onClick={createGame}>New game</Button>
        </Sider>
        <Content className="games">
            <Card className="games-list" bordered={false} title="Games played">
                <Form className="search-form" layout="inline" initialValues={{
                    orderBy: 'rounds'
                } as ISearchGameParams} onFinish={onSearch}>
                    <Form.Item label="Player" name="player">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Date" name="date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="Sort" name="orderBy">
                        <Radio.Group>
                            <Radio value='created_at'>
                                Date
                            </Radio>
                            <Radio value='rounds'>
                                Number of rounds
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary">Search</Button>
                    </Form.Item>
                </Form>
                {renderGamesPlayed(props.gamesPlayed)}
            </Card>
        </Content>
    </div>;
};

export default LeaderBoardComponent;
