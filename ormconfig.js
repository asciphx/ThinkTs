module.exports = {
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": "root",
    "password": "",
    "database": "spring",
    "synchronize": true,
    "entities": [`${process.env.NODE_ENV==='production'?'dist':'ts'}/entity/*{.ts,.js}`],
    // "logging": [ "query", "error" ]
};