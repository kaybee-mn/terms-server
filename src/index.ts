import express from 'express';
import dotenv from 'dotenv';
import simplifyRoutes from './routes/simplify';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// exposing simplify routes
app.use('/api/simplify', simplifyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});