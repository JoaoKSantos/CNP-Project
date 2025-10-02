import express from 'express';
import authRoutes from './routes/auth.js'
import criminososRoutes from './routes/criminososRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

export const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api', authRoutes)

app.use('/api', criminososRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor esta rodando na porta http://localhost:${PORT}`)
    console.log(`Documentação rodando na porta http://localhost:${PORT}/api/docs`)
});