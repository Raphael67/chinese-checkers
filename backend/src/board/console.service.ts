import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Board, Coords } from './board';
import consoleConfiguration from './console.configuration';

export class ConsoleService {
    public constructor(
        @Inject(consoleConfiguration.KEY)
        private readonly config: ConfigType<typeof consoleConfiguration>,
    ) { }

    public async drawBoard(board: Board): Promise<void> {
        if (!this.config.enabled) return;
        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();
        console.log('------------------------------------------------');
        for (let y = 0; y < 17; y++) {
            let row = '';
            for (let x = 0; x < 25; x++) {
                const cell = board.getCell(new Coords(x, y));
                if (!cell) row += ' ';
                else row += cell.getPawn() === undefined ? '.' : cell.getPawn();
            }
            console.log(row);
        }
        console.log('------------------------------------------------');
        await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), this.config.timeout * 1000);
        });
    }
}