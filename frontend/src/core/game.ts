import { Store } from 'redux';
import { setPath, setPawnPlace, setPossiblePlaces } from 'redux/actions/game.action';
import Board from './board';

export default class Game {
    private board: Board = new Board();
    private pawnTaken?: string;
    private possiblePlaces?: IPath[];
    private path: IPath[] = [];

    constructor(private store: Store<any, any>) { }

    public takePawn(pawn: string) {
        this.setPawn(this.board.getPossiblePlacesForPawn(pawn), pawn);
    }

    public placePawn(place: string) {
        if (this.pawnTaken) {
            this.board.placePawn(this.pawnTaken, place);
            setPawnPlace(this.store.dispatch, this.pawnTaken, place);
            this.setPawn([]);
        }
    }

    private setPawn(possiblePlaces: IPath[], pawn?: string) {
        this.path = [];
        this.pawnTaken = pawn;
        this.possiblePlaces = possiblePlaces;
        setPossiblePlaces(this.store.dispatch, this.possiblePlaces.map((path: IPath) => path.place));
        setPath(this.store.dispatch, this.getPath(this.path));
    }

    private getPath(path: IPath[]): IPath['place'][] {
        return path.map((pathPart: IPath) => pathPart.place);
    }

    public clickPlace(place: string) {
        // If click on a place already clicked, reset path to this place
        if (this.getPath(this.path).includes(place)) {
            this.path = this.path.reduce((newPath: IPath[], pathPart: IPath) => {
                return !newPath.find((newPathPart: IPath) => newPathPart.place === place) ? newPath.concat([pathPart]) : newPath;
            }, []);

            this.setPathAndPossiblePlaces(place, this.path);

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