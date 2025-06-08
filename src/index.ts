import express from 'express';
import dotenv from 'dotenv';
import simplifyRoutes from './routes/simplify';
import simplificationRoutes from './routes/simplifications';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// exposing simplify routes
app.use('/api/simplify', simplifyRoutes);
app.use('/api/simplifications', simplificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});