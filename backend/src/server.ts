import express from 'express';
import { PrismaClient } from '../generated/prisma';
import userRoutes from './routes/user';
import movieRoutes from './routes/movies'
import seriesRoutes from './routes/series';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use('/api/users',userRoutes);
app.use('/api/movies',movieRoutes);
app.use('/api/series',seriesRoutes);


// Endpoint para / 
// ao retirar esta rota iremos ter um erro Cannot Get /
app.get('/', (req, res) => {
  res.send('API Pickerhut!');
});



//Ficar no fim de tudo
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});