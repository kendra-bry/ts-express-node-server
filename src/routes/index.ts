import { Router } from 'express';
import * as contactRoute from './contact';

const router = Router();

router.use(contactRoute.default);

export default router;
