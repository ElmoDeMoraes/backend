import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './schema'
import { context } from './context'

const __ports = {
  https : 4443,
  http  : 4000
};

const fs = require("mz/fs");
const https = require('https'); 
const app = express();

var httpsServer = null;
(async () => {
  
  httpsServer = await https.createServer({
		key: await fs.readFile(`./etc/ssl/key.key`, { encoding: 'utf8' }),
		cert: await fs.readFile(`./etc/ssl/cert.crt`, { encoding: 'utf8' })
	}, app).listen(__ports.https)

  await (function() {
    console.log(`Server are running: https: ${__ports.https}`);    
  })();

} )();
app.listen(__ports.http)

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    context: context,
    graphiql: true,
  }),
)
app.use(express.static('frontend_bundles'))
app.use((req, res, next) => {
  
  res.status(404).send("Não foi possível completar sua chamada. Por favor, verifique o número ligado ou consulte a lista telefônica")
})

app.disable('x-powered-by')

//error 500
/*app.use(  (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Não foi possível completar sua chamada. Por favor, verifique o número ligado ou consulte a lista telefônica.')
});*/





console.log(`\
🚀 Server ready at: http://localhost:4000/graphql
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
`)
