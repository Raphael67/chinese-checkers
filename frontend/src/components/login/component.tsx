import { RightOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import Pawn from 'components/game/pawn';
import { ColourPosition } from 'core/board';
import React, { ReactElement, useEffect, useState } from 'react';
import './index.less';

interface IProps {
    errorMessage?: string;
    login: (playerName: string, position: number) => void;
    goToGame: () => void;
    game?: IGame;
}

const LoginComponent = (props: IProps): ReactElement => {

    const [form] = Form.useForm<IGamePlayer[]>();

    useEffect(() => {
        const game = props.game;
        form.setFieldsValue((game && game.players) || []);
    }, [props.game, form]);

    const getPlayablePositions = (players: IGamePlayer[]): number[] => {
        return Object.keys(ColourPosition).map((position: string) => {
            const positionIndex = Number(position);
            if (players.find((player: IGamePlayer) => player.position === positionIndex && ['idle', 'disconnected', undefined].includes(player.status))) {
                return positionIndex;
            }
            return undefined;
        }).filter((position?: number) => position) as number[];
    };

    const [savedPositions, setSavedPositions] = useState<Record<string, string>>();

    const onLogin = (position: number, playerName?: string) => {
        if (playerName) {
            props.login(playerName, position);
        }
    };

    const renderPlayerPlaces = (players: IGamePlayer[], savedColours?: Record<string, string>): ReactElement[] => {
        return Object.keys(ColourPosition).map((position: string) => {
            const positionIndex = Number(position);
            const player = players.find((player: IGamePlayer) => player.position === positionIndex);
            return <div key={position} className="player">
                <Pawn colour={ColourPosition[positionIndex]} r={20} alone={true} />
                <Form.Item name={`nickname[${position}]`} initialValue={player?.nickname}>
                    {renderPlayerPlace(getPlayablePositions(players), positionIndex, player, savedColours)}
                </Form.Item>
            </div>;
        });
    };

    const renderPlayerPlace = (playablePositions: number[], position: number, player?: IGamePlayer, savedColours?: Record<string, string>): ReactElement => {
        if (player) {
            if (player.status === 'disconnected') {
                return <Input bordered={false} className="disconnected" readOnly={true} size="large" suffix={<Button disabled={!playablePositions.includes(position)} onClick={goToGame} type="primary" icon={<RightOutlined />}></Button>} />;
            }
            return <Input bordered={false} readOnly={true} size="large" />;
        }

        const key = `nickname[${position}]`;
        const playerName = savedColours && savedColours[key];
        return <Input size="large" placeholder="Your pseudo" prefix={<UserOutlined />} suffix={
            <Button onClick={() => onLogin(position, playerName)} disabled={!playerName} type="primary" icon={<RightOutlined />}></Button>
        } />;
    };

    const goToGame = () => {
        props.goToGame();
    };

    const error = props.errorMessage ? <Alert type="error" message={props.errorMessage} /> : undefined;

    return props.game ? <Form
        form={form}
        onValuesChange={(values: Record<string, string>) => {
            setSavedPositions({ ...savedPositions, ...values });
        }}
        className="login-component"
    >
        {error}
        {renderPlayerPlaces((props.game && props.game.players) || [], savedPositions)}
        <Button size="large" onClick={goToGame}>Watcher mode</Button>
    </Form> : <Form form={form}></Form>;
};

export default LoginComponent;
