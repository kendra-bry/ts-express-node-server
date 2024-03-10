import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
