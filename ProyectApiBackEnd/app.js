const path = require('path')
const express = require('express');
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');

const authRoutes = require('./routes/auth')
const feedRoutes = require('./routes/feed');
const {dbConnection} = require('./database/connection')

const app = express();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },
  filename: function(req, file, cb) {
      cb(null, uuidv4() + file.originalname )
  }
});
const fileFilter = (req,file,cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null,true)
  } else {
    cb(null,false)
  }
}

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: true }));
app.use(
  multer({storage  , fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname,'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);



app.use((err,req,res,next) => {
  console.log(err)
  const status = err.statusCode || 500;
  const message = err.message
  const data = err.data
  res.status(status).json({message, data})
})

dbConnection()
  .then(result => {
   
    const server = app.listen(8080); 
    const io = require('./socket').init(server)
    
    io.on('connection', socket => {
      console.log('client connected')
    })
    
  })
  .catch(err => {
    console.log(err);
  });




