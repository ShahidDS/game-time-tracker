import express from 'express';
import userRoutes from './src/routes/userRoutes.ts';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});