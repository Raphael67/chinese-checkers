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
            //this.setPawn([]);
            setPawnPlace(this.store.dispatch, this.pawnTaken, place);
        }
    }

    private setPawn(possiblePlaces: string[], pawn?: string) {
        this.path = [];
        this.pawnTaken = pawn;
        this.possiblePlaces = possiblePlaces;
        setPossiblePlaces(this.store.dispatch, this.possiblePlaces);
    }

    public clickPlace(place: string) {
        if (this.pawnTaken) {
            this.possiblePlaces = this.board.getPossiblePlacesForPlace(place);
            setPossiblePlaces(this.store.dispatch, this.possiblePlaces);

            this.path.push(place);
            setPath(this.store.dispatch, this.path);
        }
    }

    public doubleClickPlace(place: string) {
        if (this.pawnTaken) {
            this.placePawn(place);
        }
    }
}