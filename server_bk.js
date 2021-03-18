const Koa = require('koa');

const server = new Koa();

server.use(async ctx => (ctx.body = "hello koa app"));

server.listen(3000,() => console.log('server is running on 3000'));