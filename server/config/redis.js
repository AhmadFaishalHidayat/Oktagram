const Redis = require('ioredis')
const redis = new Redis({
    port: 12855,
    host: 'redis-12855.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com',
    username: "default",
    password: process.env.PASSWORD_REDIS,
    db: 0
})

module.exports = redis;