import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

@Injectable()
export class AppService {
    default(): string {
        return 'api server is running';
    }

    pv(): number {
        const jsonPath = resolve(__dirname, './app.json');
        if (!existsSync(jsonPath)) {
            writeFileSync(jsonPath, JSON.stringify({ pv: 1 }));
            return 1;
        }
        
        const json = readFileSync(jsonPath, 'utf-8');
        const { pv } = JSON.parse(json);

        const nextPv = pv + 1;
        writeFileSync(jsonPath, JSON.stringify({ pv: nextPv }));

        return nextPv
    }
}
