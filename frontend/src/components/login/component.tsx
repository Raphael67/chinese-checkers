import { RightOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import React, { ChangeEvent, ReactElement, useState } from 'react';
import { Colour } from '../game/board';
import Pawn from '../game/pawn';
import './index.less';

interface IProps {
    errorMessage?: string;
    login: (params: IRegisterParams) => void;
    goToGame: () => void;
    players: IPlayer[];
}

const colours = [Colour.Black, Colour.Blue, Colour.Green, Colour.Red, Colour.Yellow, Colour.Purple];

const LoginComponent = (props: IProps): ReactElement => {
    const getPlayableColours = (players: IPlayer[]): Colour[] => {
        return colours.map((colour: Colour) => {
            if (players.find((player: IPlayer) => player.colour === colour && ['idle', 'disconnected', undefined].includes(player.status))) {
                return colour;
            }
            return undefined;
        }).filter((colour?: Colour) => colour) as Colour[];
    };

    const [playableColours, setPlayableColours] = useState<Colour[]>(getPlayableColours(props.players));

    const onLogin = (credentials: IRegisterParams) => {
        props.login(credentials);
    };

    const setPlayer = (value: string, isPlayableColour: boolean, playableColours: Colour[], colour: Colour) => {
        if (value === '') {
            setPlayableColours(playableColours.filter((cl: Colour) => cl !== colour));
        }
        else if (!isPlayableColour) {
            setPlayableColours(playableColours.concat([colour]));
        }
    };

    const renderPlayerPlaces = (playableColours: Colour[], players: IPlayer[]): ReactElement[] => {
        return colours.map((colour: Colour) => {
            const player = players.find((player: IPlayer) => player.colour === colour);
            return <Form.Item
                className="player"
                key={colour}
            >
                <Pawn colour={colour} r={20} alone={true} />
                {renderPlayerPlace(playableColours, colour, player)}
            </Form.Item>;
        });
    };

    const renderPlayerPlace = (playableColours: Colour[], colour: Colour, player?: IPlayer): ReactElement => {
        const isPlayableColour = playableColours.includes(colour);
        if (player) {
            if (player.status === 'disconnected') {
                return <Input bordered={false} className="disconnected" readOnly={true} size="large" value={player.name} suffix={<Button disabled={!isPlayableColour} onClick={goToGame} type="primary" icon={<RightOutlined />}></Button>} />;
            }
            return <Input bordered={false} readOnly={true} size="large" value={player.name} />;
        }

        return <Input onChange={(event: ChangeEvent<HTMLInputElement>) => setPlayer(event.currentTarget.value, isPlayableColour, playableColours, colour)} size="large" placeholder="Your pseudo" prefix={<UserOutlined />} suffix={
            <Button disabled={!isPlayableColour} onClick={goToGame} type="primary" icon={<RightOutlined />}></Button>
        } />;
    };

    const goToGame = () => {
        props.goToGame();
    };

    const error = props.errorMessage ? <Alert type="error" message={props.errorMessage} /> : undefined;

    return <Form
        onFinish={onLogin}
        className="login-component"
    >
        {error}
        {renderPlayerPlaces(playableColours, props.players)}
        <Button size="large" onClick={goToGame}>Watcher mode</Button>
    </Form>;
};

export default LoginComponent;
