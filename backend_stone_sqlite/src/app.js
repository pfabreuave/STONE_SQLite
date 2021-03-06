import express from 'express';
import fs from 'fs';
import https from 'https';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

import router from './routes.js'
app.use(router);

//app.listen( 3000, ()=>console.log("Api Rodando. "))

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Api Rodando na porta ", port);
});