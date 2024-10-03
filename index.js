import 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import https from 'https';

const app = express();
const PORT = 4000;

const privateKey = fs.readFileSync('cert/localhost-key.pem');
const certificate = fs.readFileSync('cert/localhost.pem');
const options = {
  key: privateKey,
  cert: certificate,
};

app.use(cors({
  origin: 'https://localhost:3000',
  credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const {id, password} = req.body;
  let token = jwt.sign({data: id}, 'secret', {expiresIn: '1h', algorithm: 'HS256'});
  res.cookie('jwt', token, {
    sameSite: 'none',
    secure: true,
    maxAge: 3600,
  })
  console.log('https 연결 성공');
  return res.send('cookie');
})

app.get('/jwt', (req, res) => {
  console.log(req.cookies);
  return res.send('cookie');
})

const httpsServer = https.createServer(options, app);
httpsServer.listen(PORT, () => console.log(`${PORT} 포트 서버 연결 성공`))