const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
var router = new Router();
const aws = require('aws-sdk')
const config = require('./config')
const axios = require('axios');
const uuid = require('uuid')

console.log(config)

aws.config = new aws.Config({
  accessKeyId: config.ACCESS_KEY_ID,
  secretAccessKey: config.SECRET_ACCESS_KEY
})

const client = new aws.S3()
 
router.get('/', (ctx, next) => {
  const data = {
    contentType: 'image/png'
  }

  let params = {
    // ContentType: fileExtension(data.contentType),
    Expires: 60 * 60,
    // ACL: 'bucket-owner-full-control',
    Bucket: config.BUCKET_NAME,
    Key: randomName() + '.' + fileExtension(data.contentType)
  }
  console.log(params)
  const url = client.getSignedUrl('putObject', params)
  console.log(url)
  ctx.body = 'Hello Koa Get';
})

router.post('/', (ctx, next) => {
  ctx.body = 'Hello Koa Post'
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