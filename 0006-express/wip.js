const express = require('express');
const { toXML } = require('jstoxml')
const server = express();
const axios = require('axios')
// server.use('/csv/', csvRouter)


// const convertJsonToCsv = (req, res, next) => {
//     // convert json to csv
//     console.log('converting json to csv')    
//     const csv = `id,name,age
//                     123456789,Israel Israeli,50
//                     74564376543,Moshe Moshe,30`;
//     req.csv = csv;                    
//     next()
// };

// const notAllowed = (req, res, next) => {
//     res.status(405).send('method not allowed')
// }

// const logCsvLength = (req, res, next) => {
//     console.log(`csv length is ${req.csv?.length}`)
//     next()
// }

const auth = (req, res, next) => {
    if(req.headers.authorization.split(' ')[1] !== '123') res.status(401).send('unauthorized');
    console.log('authorization success');
    next();
}


// csvRouter.patch('/', notAllowed)
// csvRouter.put('/', notAllowed)
// csvRouter.delete('/', notAllowed)

// csvRouter.use((req, res, next) => {
//     // connect to mongo
//     const isConnected = true;
//     if(!isConnected) res.status(500).send('could not connect to mongo')
//     console.log('connected to mongo')
//     next()
// })

// csvRouter.get('/', (req, res, next) => {
//     res.on('finish', () => {
//         console.log('response finished, disconnecting from mongo')
//     })
//     next()
// })

// csvRouter.get('/', convertJsonToCsv, logCsvLength, (req, res, next) => {
//     console.log('in csv GET')
//     res.status(200).send(req.csv)
//     console.log('response sent')
//     req.sentToUSer = true;
//     // next()
// })

// csvRouter.post('/', (req, res, next) => {
//     console.log('in csv POST')
//     // next()
// })

// csvRouter.use((req, res, next) => {
//     // disconnect from mongo
//     console.log('disconnected from mongo')
// })

// server.get('/json', (req, res, next) => {
//     // extract 234 out of req
//     console.log('in json GET')
// })

// server.post('/json', express.urlencoded(), (req, res, next) => {
//     console.log('in json POST')
// })

const readUsers = async (req, res, next) => {
    try {
      const response = await axios('https://jsonplaceholder.typicode.com/users');
      req.data = response.data;
      next();
    } catch (err) {
      next(err);
    }
  };

const filterUsers = (req, res, next) => {
    const offset = +req.query.offset || 0;
    const limit = +req.query.limit || 10;
    req.data = req.data.slice(offset, offset + limit);
    next();
};

const respond = (req, res, next) => {
    if (req.query.format === 'xml') {
        res.setHeader('Content-type', 'text/xml');
        return res.send(toXML(req.data));
      }
    else return res.json(req.data);
};

const notFound = (req, res, next) => {
    res.status(404).send('not found');
};


server.use(auth);
server.get('/users', readUsers, filterUsers, respond);
server.use(notFound);

server.listen(8080, () => {
      console.log('started...')
})