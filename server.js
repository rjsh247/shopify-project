require('isomorphic-fetch');
require('fs.promises');
const dotenv = require('dotenv');

var request = require('request')


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
console.log('sskdncdsjncjsdncsd');
// console.log(process.env);
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
           console.log(ctx.session);
           console.log('chacha');
           ctx.redirect('/');
      },
    }),
    ); 
    const router = new Router();
    const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

    router.post('/webhooks/products/create', webhook, (ctx) => {
        console.log('received webhook: ', ctx.state.webhook);
    });  


       let new_product = {
        product: {
            title: "2 Dell Laptop with 8GB RAM i5",
            body_html: "<strong>Laptop On Sale</strong>",
            vendor: "Dell",
            product_type: "mobile",
            tags: "laptop,mobile,i5"
        }
    };
    // console.log(req.query.shop);
    let url = 'https://mychetu.myshopify.com/admin/api/2020-07/products.json';

    // let options = {
    //     method: 'POST',
    //     uri: url,
    //     json: true,
    //     headers: {
    //         'X-Shopify-Access-Token': process.env.SHOPIFY_API_SECRET_KEY,
    //         'content-type': 'application/json'
    //     },
    //     body: new_product//pass new product object - NEW - request-promise problably updated
    // };

// fetch('https://mychetu.myshopify.com/admin/api/2020-07/products.json', {
//   method: 'post',
//   body: JSON.stringify(new_product),

//   headers: {
//     'X-Shopify-Access-Token': process.env.SHOPIFY_API_SECRET_KEY,
//     'Accept': 'application/json'
//   },

// })

console.log('yyyy');
console.log(process.env.SHOPIFY_API_SECRET_KEY);
  request({
  uri: "https://mychetu.myshopify.com/admin/api/2020-07/products.json",
  method: 'POST',
  body: JSON.stringify(new_product),
  json: true,
  headers: {
    'X-Shopify-Access-Token': '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',
    'Accept': 'application/json'
  },
  resolveWithFullResponse: true
}, function (error, response, body) {
    console.log(response);
})



    // request.post(options, function (parsedBody) {
    //         console.log(parsedBody);
    //         console.log('rajesh srivasat');
    //         // res.json("good");
    //     });




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