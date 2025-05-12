import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './server/db.js';

import userRoutes from './server/routes/users.js';

const index = express();
const PORT = process.env.PORT || 3001;

index.use(cors());
index.use(express.json());

index.use('/api/users', userRoutes);

connectToDatabase().then(() => {
  index.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
