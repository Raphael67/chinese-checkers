import { RightOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import Pawn from 'components/game/pawn';
import { Colour } from 'core/board';
import React, { ReactElement, useEffect, useState } from 'react';
import './index.less';

interface IProps {
    errorMessage?: string;
    login: (playerName: string, colour: Colour) => void;
    goToGame: () => void;
    game: IGame;
}

const colours = [Colour.Black, Colour.Blue, Colour.Green, Colour.Red, Colour.Yellow, Colour.Purple];

const LoginComponent = (props: IProps): ReactElement => {

    const [form] = Form.useForm<IGamePlayer[]>();

    useEffect(() => {
        form.setFieldsValue(props.game.players || []);
    }, [props.game, form]);

    const getPlayableColours = (players: IGamePlayer[]): Colour[] => {
        return colours.map((colour: Colour) => {
            if (players.find((player: IGamePlayer) => player.colour === colour && ['idle', 'disconnected', undefined].includes(player.status))) {
                return colour;
            }
            return undefined;
        }).filter((colour?: Colour) => colour) as Colour[];
    };

    const [savedColours, setSavedColours] = useState<Record<string, string>>();

    const onLogin = (colour: Colour, playerName?: string) => {
        if (playerName) {
            props.login(playerName, colour);
        }
    };

    const renderPlayerPlaces = (players: IGamePlayer[], savedColours?: Record<string, string>): ReactElement[] => {
        return colours.map((colour: Colour) => {
            const player = players.find((player: IGamePlayer) => player.colour === colour);
            return <div key={colour} className="player">
                <Pawn colour={colour} r={20} alone={true} />
                <Form.Item name={`nickname[${colour}]`} initialValue={player?.nickname}>
                    {renderPlayerPlace(getPlayableColours(players), colour, player, savedColours)}
                </Form.Item>
            </div>;
        });
    };

    const renderPlayerPlace = (playableColours: Colour[], colour: Colour, player?: IGamePlayer, savedColours?: Record<string, string>): ReactElement => {
        if (player) {
            if (player.status === 'disconnected') {
                return <Input bordered={false} className="disconnected" readOnly={true} size="large" suffix={<Button disabled={!playableColours.includes(colour)} onClick={goToGame} type="primary" icon={<RightOutlined />}></Button>} />;
            }
            return <Input bordered={false} readOnly={true} size="large" />;
        }

        const key = `nickname[${colour}]`;
        const playerName = savedColours && savedColours[key];
        return <Input size="large" placeholder="Your pseudo" prefix={<UserOutlined />} suffix={
            <Button onClick={() => onLogin(colour, playerName)} disabled={!playerName} type="primary" icon={<RightOutlined />}></Button>
        } />;
    };

    const goToGame = () => {
        props.goToGame();
    };

    const error = props.errorMessage ? <Alert type="error" message={props.errorMessage} /> : undefined;

    return <Form
        form={form}
        onValuesChange={(values: Record<string, string>) => {
            setSavedColours({ ...savedColours, ...values });
        }}
        className="login-component"
    >
        {error}
        {renderPlayerPlaces(props.game.players || [], savedColours)}
        <Button size="large" onClick={goToGame}>Watcher mode</Button>
    </Form>;
};

export default LoginComponent;
