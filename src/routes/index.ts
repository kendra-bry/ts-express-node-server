import { Router } from 'express';
import * as contactRoute from './contacts';

const router = Router();

router.use('/contacts', contactRoute.default);

export default router;
