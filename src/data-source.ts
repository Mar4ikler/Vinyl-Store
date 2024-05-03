import { DataSource } from 'typeorm';

export const postgresDataSource = new DataSource({
    type: 'postgres',
    host: 'roundhouse.proxy.rlwy.net',
    port: 34855,
    username: 'postgres',
    password: 'CHmpoqgKaHechIRTjFQoDoVkYpaSLhot',
    database: 'railway',
    entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
