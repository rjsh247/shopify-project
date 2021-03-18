require('isomorphic-fetch');
require('fs.promises');
const dotenv = require('dotenv');


const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
dotenv.config();

// const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
// const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
// const getSubscriptionUrl = require('./server/getSubscriptionUrl');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
} = process.env;

app.prepare().then(() =>{
    const server = new Koa();
    server.use(session({secure: true, sameSite: 'none'}, server));
    server.keys = [SHOPIFY_API_KEY];
    server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products'],
      async afterAuth(ctx) {
           const { shop, accessToken } = ctx.session;
           ctx.redirect('/');
      },
    }),
    ); 
    const router = new Router();
    const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

    router.post('/webhooks/products/create', webhook, (ctx) => {
        console.log('received webhook: ', ctx.state.webhook);
    });  

//       let new_product = {
//         product: {
//             title: 'Burton Custom Freestyle 151',
//             body_html: "<strong>Good snowboard!</strong>",
//             vendor: "Burton",
//             product_type: 'Snowboard',
//             tags: [
//                 "Barnes & Noble",
//                 "John's Fav"
//             ]
//         }
//     };


const resoponce = fetch('https://mychetu.myshopify.com/admin/api/2020-07/products.json', {
  method: 'post',
  body: JSON.stringify(new_product),

  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_API_SECRET_KEY,
    'Accept': 'application/json'
  },

});

console.log(resoponce);

    // server.use(verifyRequest());
    server.use(async (ctx) => {
        await handle(ctx.req,ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
        return;
    })
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});