import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => {
    console.log(process.env.MONGODB_HOST);
    return {
        host: process.env.MONGODB_HOST || 'localhost',
        port: parseInt(process.env.MONGODB_PORT || '27017', 10),
    };
});