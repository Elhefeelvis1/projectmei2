import pg from 'pg';

const db = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'campus-mart',
    password: 'Marcelinus',
    port: 5432
});

export default db;