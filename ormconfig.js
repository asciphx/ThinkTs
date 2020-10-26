module.exports = {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "",
    database: "spring",
    synchronize: true,
    entities: [`${process.env.NODE_ENV==='production'?'dist':'ts'}/entity/*{.ts,.js}`],
    cache: {
        type: "database",duration: 25000
    },
    extra: {
        max: 9,
        connectionTimeoutMillis: 2000
    }
    // logging: [ "query", "error" ]
};