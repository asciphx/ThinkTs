module.exports = {
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": "root",
    "password": "fastjs",
    "database": "spring",
    "synchronize": true,
    "logging": false,
    "entities": [`${process.env.NODE_ENV==='production'?'dist':'ts'}/entity/*{.ts,.js}`],
    "synchronize": true,
    // "logging": [ "query", "error" ]
};