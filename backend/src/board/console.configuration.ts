import { registerAs } from '@nestjs/config';

export default registerAs('console', () => {
    return {
        enabled: process.env.CONSOLE_ENABLED || false,
        timeout: parseInt(process.env.CONSOLE_TIMEOUT || '1', 10),
    };
});