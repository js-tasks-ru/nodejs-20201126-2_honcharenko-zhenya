const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const delay = new Promise((resolve) => {
    ctx.app.on('MESSAGE', ({ message }) => {
      if (message) {
        resolve(message);
      }
    })
  });
  try {
    const message = await delay;
    ctx.body = message;
  } catch(e) {
    ctx.throw(500);
  }
});

router.post('/publish', async (ctx, next) => {
  ctx.app.emit('MESSAGE', ctx.request.body)
  ctx.status = 201;
});

app.use(router.routes());

module.exports = app;
