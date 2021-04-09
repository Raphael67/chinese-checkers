import { Store } from 'redux';
import { setPath, setPawnPlace, setPossiblePlaces } from '../redux/actions/game.action';
import Board from './board';

export default class Game {
    private board: Board = new Board();
    private pawnTaken?: string;
    private possiblePlaces?: string[];
    private path: string[] = [];

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

    private setPawn(possiblePlaces: string[], pawn?: string) {
        this.path = [];
        this.pawnTaken = pawn;
        this.possiblePlaces = possiblePlaces;
        setPossiblePlaces(this.store.dispatch, this.possiblePlaces);
        setPath(this.store.dispatch, this.path);
    }

    public clickPlace(place: string) {
        // If click on a place already clicked, reset path to this place
        if (this.path.includes(place)) {
            this.path = this.path.reduce((newPath: string[], pathPlace: string) => {
                return !newPath.includes(place) ? newPath.concat([pathPlace]) : newPath;
            }, []);
            this.setPathAndPossiblePlaces(place, this.path);
        }
        else if (this.pawnTaken && this.possiblePlaces?.includes(place)) {
            this.path.push(place);
            this.setPathAndPossiblePlaces(place, this.path);
        }
    }

    public doubleClickPlace(place: string) {
        if (this.pawnTaken && this.path.includes(place)) {
            this.placePawn(place);
        }
    }

    private setPathAndPossiblePlaces(place: string, path: string[]) {
        // Get possible places and remove entries from path
        this.possiblePlaces = this.board.getPossiblePlacesForPlace(place).filter((possiblePlace: string) => !path.includes(possiblePlace));
        setPossiblePlaces(this.store.dispatch, this.possiblePlaces);
        setPath(this.store.dispatch, this.path);
    }
}