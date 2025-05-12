import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './server/db.js';
import { swaggerSpec } from './server/swagger.js';

import userRoutes from './server/routes/users.js';
import swaggerUi from "swagger-ui-express";

const index = express();
const PORT = process.env.PORT || 3001;

index.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
index.use(cors());
index.use(express.json());

index.use('/api/users', userRoutes);

connectToDatabase().then(() => {
  index.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
