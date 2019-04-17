const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
var router = new Router();
const send = require('koa-send')
const aws = require('aws-sdk')
const config = require('./config')
const axios = require('axios');
const uuid = require('uuid')

aws.config = new aws.Config({
  accessKeyId: config.ACCESS_KEY_ID,
  secretAccessKey: config.SECRET_ACCESS_KEY
})

const client = new aws.S3()
 
router.post('/', async (ctx, next) => {
  await send(ctx, 'index.html');
})

router.get('/', (ctx, next) => {
  const data = {
    contentType: 'image/png'
  }

  let params = {
    ContentType: data.contentType,
    Expires: 60 * 60,
    Bucket: config.BUCKET_NAME,
    Key: randomName() + '.' + fileExtension(data.contentType)
  }
  
  const url = client.getSignedUrl('putObject', params)
  ctx.body = url;
})

app
  .use(router.routes())
  .use(router.allowedMethods());
 
app.listen(3000)

function randomName () {
  return uuid.v4()
}

function fileExtension (contentType) {
  return contentType.replace('image/', '')
}