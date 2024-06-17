import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

//Rutas
import carritoRouter from './routes/carrito.router.js';
import realTimeProducts from './routes/realTimeProducts.router.js';
import productosRouter from './routes/productos.router.js';
import userRouter from './routes/user.router.js';
import loginRouter from './routes/login.router.js';
import logoutRouter from './routes/logout.router.js'; 
import registerRouter from './routes/register.router.js';

//Servers y DDBB
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { productModel } from '../src/models/productos.model.js';
import { Server } from 'socket.io';
import passport from 'passport';
import './config/passport.config.js'

// Init Servers
const app = express()
const httpServer = app.listen(8080  , () => console.log("Servidor arriba en el puerto 8080..."))
const io = new Server(httpServer)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect('mongodb+srv://nicolaschaves1991:iYm9g3zcwk40HyyF@coderhousebackend.uunghaj.mongodb.net/?retryWrites=true&w=majority').then(() => {
  // Conexión exitosa
  console.log('Conexión a la base de datos establecida');
})
.catch((error) => {
  // Error en la conexión
  console.error('Error al conectar a la base de datos:', error);
});

// Configuración de sesión
app.use(session({
  store:MongoStore.create({
    mongoUrl:'mongodb+srv://nicolaschaves1991:iYm9g3zcwk40HyyF@coderhousebackend.uunghaj.mongodb.net/?retryWrites=true&w=majority',
    mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
    ttl:60000
  }),
  secret: 'secretKey',
  resave: true,
  saveUninitialized: true
}));

//Configuracion de passport
app.use(passport.initialize())
app.use(passport.session())

// Config engine templates
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static('./src/public'));
app.use(express.json());
app.use('/static', express.static('public'));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/realtimeproducts', realTimeProducts)
app.use('/api/productos', productosRouter);
app.use('/api/carts', carritoRouter);
app.use('/api/users',userRouter);
app.use('/api/login',loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/register', registerRouter);

const messages = []

io.on('connection', socket => {
    console.log('New client connected');

    socket.on('pedido', async data => {

        console.log("SERVER: ", {data});
        const { tittle, description, code, price, status, stock, category } = data

        console.log("titulo: ",tittle);

        await productModel.create({ tittle, description, code, status, stock, category });
        const products = await productModel.find();

        console.log(products)
        socket.emit('update',products)
        
    })
    
    socket.on('message', data => {
        messages.push(data)
        io.emit('logs', messages)
    })
})