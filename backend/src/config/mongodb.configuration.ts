import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => {
    return {
        host: process.env.MONGODB_HOST || 'localhost',
        port: parseInt(process.env.MONGODB_PORT || '27017', 10),
    };
});