import { Store } from 'redux';
import { setPath, setPawnPlace, setPawns, setPossiblePlaces } from 'redux/actions/game.action';
import Api from 'services/api';
import Board, { ColourPosition } from './board';

export default class Game {
    private id?: string;
    private playerPosition?: number;
    private board: Board = new Board();
    private pawnTaken?: IPawn;
    private possiblePlaces?: IPath[];
    private path: IPath[] = [];

    constructor(private store: Store<any, any>) { }

    public setId(id: string) {
        this.id = id;
    }

    public setPlayerPosition(position: number) {
        this.playerPosition = position;
    }

    public async getBoard(gameId: string): Promise<IBoard> {
        const board: IBoard = {};
        const rawBoard = await Api.getBoard({
            gameId
        }).catch((err) => {
            throw err;
        });

        rawBoard.forEach((rawPawn: IRawPawn) => {
            const pawnPlace = this.board.getPawnFromRaw(rawPawn);
            board[pawnPlace.pawn.id] = pawnPlace.place;
        });

        return board;
    }

    public async initBoard(gameId: string) {
        this.board.initBoard((await Api.getBoard({
            gameId
        }).catch((err) => {
            throw err;
        })).map((rawPawn: IRawPawn, index: number) => {
            const { pawn, coords } = rawPawn;
            return {
                pawn: {
                    colour: ColourPosition[pawn],
                    id: `pawn${index}`
                },
                position: {
                    x: coords.x,
                    y: coords.y
                }
            };
        }));

        setPawns(this.store.dispatch, this.board.getPawns());
    }

    public async getMoves(gameId: string): Promise<IPawnPlace[]> {
        return (await Api.getMoves({
            gameId
        }).catch((err) => {
            throw err;
        })).map((position: IPosition) => {
            return this.board.getPawnPlaceByPosition(position);
        });
    }

    public takePawn(pawnId: string) {
        const pawn = this.board.getPawnById(pawnId);
        this.setPawn(this.board.getPossiblePlacesForPawn(pawn), pawn);
    }

    public placePawn(place: string) {
        if (this.pawnTaken && this.id && this.playerPosition !== undefined) {
            const fullPath = [{
                place: this.board.getPlaceForPawn(this.pawnTaken)
            },
            ...this.path
            ];

            this.board.placePawn(this.pawnTaken, place);
            setPawnPlace(this.store.dispatch, this.pawnTaken, place);

            Api.newMove({
                gameId: this.id,
                playerIndex: this.playerPosition,
                moves: fullPath.map((path: IPath) => {
                    const position = this.board.getPositionForPlace(path.place);
                    return [position.x, position.y];
                })
            });

            this.setPawn([]);
        }
    }

    private setPawn(possiblePlaces: IPath[], pawn?: IPawn) {
        this.path = [];
        this.pawnTaken = pawn;
        this.possiblePlaces = possiblePlaces;
        setPossiblePlaces(this.store.dispatch, this.possiblePlaces.map((path: IPath) => path.place));
        setPath(this.store.dispatch, this.getPath(this.path));
    }

    private getPath(path: IPath[]): IPath['place'][] {
        return path.map((pathPart: IPath) => pathPart.place);
    }

    public getPawns(): IPawnPlace[] {
        return this.board.getPawns();
    }

    public clickPlace(place: string) {
        const path = this.getPath(this.path);
        // If click on a place already clicked
        if (path.includes(place)) {
            // And it's the last place clicked, we place the pawn
            if (place === path[path.length - 1]) {
                this.doubleClickPlace(place);
            }
            // Else, reset path to this place
            else {
                this.path = this.path.reduce((newPath: IPath[], pathPart: IPath) => {
                    return !newPath.find((newPathPart: IPath) => newPathPart.place === place) ? newPath.concat([pathPart]) : newPath;
                }, []);

                this.setPathAndPossiblePlaces(place, this.path);
            }
        }
        else if (this.pawnTaken) {
            const possiblePlace = this.possiblePlaces?.find((pathPart: IPath) => pathPart.place === place);
            if (possiblePlace) {
                this.path.push(possiblePlace);

                this.setPathAndPossiblePlaces(place, this.path);
            }
        }
    }

    public doubleClickPlace(place: string) {
        if (this.pawnTaken && this.getPath(this.path).includes(place)) {
            this.placePawn(place);
        }
    }

    private setPathAndPossiblePlaces(place: string, path: IPath[]) {
        // If first move does not come from over pawn
        if (path.length > 0 && !path[0].fromOverPawn) {
            setPossiblePlaces(this.store.dispatch, []);
            setPath(this.store.dispatch, this.getPath(path));
        }
        else {
            const pathPlaces = this.getPath(path);
            // Remove entries from path and store it
            this.possiblePlaces = this.board.getPossiblePlacesForPlace(place);
            setPossiblePlaces(this.store.dispatch, this.possiblePlaces
                .filter((possiblePlace: IPath) => !pathPlaces.includes(possiblePlace.place))
                .map((possiblePlace: IPath) => possiblePlace.place));
            setPath(this.store.dispatch, pathPlaces);
        }
    }
}