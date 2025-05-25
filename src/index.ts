import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import simplifyRoutes from './routes/simplify';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/simplify', simplifyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});