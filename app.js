const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const path = require('path')
const db = require('./db/conecta')
const bodyParser = require('body-parser')
const Job = require('./models/Job')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const PORT = 3000

app.listen(PORT, function() {
    console.log(`Tudo ok ${PORT}`);
})

//body parser
app.use(bodyParser.urlencoded({extended: false}))

// handle bars
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//pasta estatica
app.use(express.static(path.join(__dirname, 'public')))

// db conexão
db
.authenticate()
.then(()=>{
    console.log('conexão bem sucetiva');
})
.catch(err => {
    console.log('erro com BD');
})

// rotas
app.get('/', (req, res) => {

    var search = req.query.job
    let query = '%' + search + '%'//busca por resultados parecidos

    if (!search) {

        Job.findAll({order:[
            ['createdAT', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs
            })
        })
        .catch(err => console.log(err))
        
    } else {

        Job.findAll({
            where: {title: {[Op.like]: query}},
            order:[
            ['createdAT', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs, search
            })
        })
    }
    
})

//rotas do Job
app.use('/jobs', require('./routes/jobs'))