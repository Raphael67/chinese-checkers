import { Injectable, Logger } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import * as convict from 'convict';
import * as fs from 'fs-extra';
import { version } from '../version.json';

const schema = {
    mailAdapter: {
        protocol: {
            default: 'smtps',
            format: String,
            env: 'MAIL_ADAPTER_PROTOCOL',
            arg: 'mail-adapter-protocol',
        },
        email: {
            default: 'user@domain.tld',
            format: String,
            env: 'MAIL_ADAPTER_EMAIL',
            arg: 'mail-adapter-email',
        },
        password: {
            default: 'password',
            format: String,
            env: 'MAIL_ADAPTER_PASSWORD',
            arg: 'mail-adapter-password',
        },
        smtp: {
            default: 'smtp',
            format: String,
            env: 'MAIL_ADAPTER_SMTP',
            arg: 'mail-adapter-smtp',
        },
    },
    database: {
        host: {
            default: 'mariadb.interop.fr',
            format: String,
            env: 'DATABASE_HOST',
            arg: 'database-host',
        },
        user: {
            default: 'interop',
            format: String,
            env: 'DATABASE_USER',
            arg: 'database-user',
        },
        password: {
            default: 'interop-password',
            format: String,
            env: 'DATABASE_PASSWORD',
            arg: 'database-password',
        },
        name: {
            default: 'interop',
            format: String,
            env: 'DATABASE_NAME',
            arg: 'database-name',
        },
        port: {
            default: 3306,
            format: Number,
            env: 'DATABASE_PORT',
            arg: 'database-port',
        },
    },
    secret: {
        doc: 'The JWT secret',
        format: String,
        default: '4gdfg3dr4g134)=3-43-(_4o*4pù4çmlm4lj3l4h"(é4é41l01b31d',
    },
};

const config = convict(schema).validate({ allowed: 'strict' });
if (fs.existsSync('.env.json')) {
    config.loadFile('./.env.json');
}
export type Config = Record<keyof typeof schema, any>;

@Injectable()
export class ConfigService {
    @Exclude()
    private logger: Logger = new Logger(ConfigService.name);

    public getVersion(): string {
        return version;
    }

    public getConfig(): typeof config {
        return config;
    }
}
