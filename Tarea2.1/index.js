import express from 'express';
import ProductsRouter from './routes/products.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>TareaAPI WYHR20222001369</title>
            <style>
                body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                    background-color:rgb(81, 81, 81);
                }
                h1 {
                    color: #fff;
                }
                p {
                    color: #fff;
                }
            </style>
        </head>
        <body>
            <h1>Bienvenido a la Tarea-API de Productos</h1>
            <p>Para ver los productos, dirígete a <strong>/products</strong></p>
        </body>
        </html>
    `);
});

app.use('/productos', ProductsRouter);
app.use((req,res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

