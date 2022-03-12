module.exports = {
    type: "mysql",port: 3306,username: "root",
    // type: "postgres",port: 5432,username: "Asciphx",
    host: "127.0.0.1",
    synchronize: true,
    password: "",
    database: "spring",
    entities: [`${process.env.NODE_ENV==='production'?'build':'app'}/entity/*{.ts,.js}`],
    cache: {
        type: "database",duration: 2300
    },
    extra: {
        max: 9,
        connectionTimeoutMillis: 2000
    },
    logging: [ "query", "error" ]
};