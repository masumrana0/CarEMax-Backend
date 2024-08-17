/**
 * Title: 'Application'
 * Description: ''
 * Author: 'Masum Rana'
 * Date: 27-12-2023
 *
 */

import express, { Application } from 'express';
import cors from 'cors';
import GlobalErrorHandler from './app/middlewares/GlobalErrorHanlder';
import handleNotFoundApi from './errors/handleNotFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        [
          'https://www.freeflexiplan.com',
          'http://localhost:3000',
          'https://freeflexiplan.vercel.app',
        ].indexOf(origin) !== -1
      ) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server Working successfully');
});
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route
app.use('/api/v1', router);
// Global Error handler
app.use(GlobalErrorHandler);

// handle not found api/ route
app.use(handleNotFoundApi);

export default app;
