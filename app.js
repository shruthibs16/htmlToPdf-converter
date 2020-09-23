var express = require('express'),
  app = express();
const path = require("path");
const puppeteer = require("puppeteer");

const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-438237.okta.com/oauth2/default', // required
  clientId:'0oa113nv8wmocewau4x7',
  assertClaims: {
    aud: 'api://default'
  }
});

function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send(err.message);
    });
}


app.get('/withAuthorization' , authenticationRequired , async function(req,res){
    const htmlFile = path.resolve("index.html");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("file://" + htmlFile);
    await page.pdf({ path: "./sample.pdf", format: "Letter" });
    await browser.close();
    res.status(200).send({"message": "you will have a pdf file in your appliaction"})
})

app.get('/pdfGenerator' , async function(req,res){
  const htmlFile = path.resolve("index.html");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("file://" + htmlFile);
  await page.pdf({ path: "./sample.pdf", format: "Letter" });
  await browser.close();
  res.status(200).send({"message": "you will have a pdf file in your appliaction"})
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log(`app listening at ${port}`)
 })