const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Question = require('./database/Question')
const Answer = require('./database/Answer')


connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados!')
    })
    .catch((msgError => {
        console.log(msgError)
    }))

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    Question.findAll({ raw: true, order: [['id', 'DESC']] }).then(questions => {
        res.render('index', {
            questions: questions
        })
    })
})

app.get('/makequestion', (req, res) => {
    res.render('makequestion')
})

app.post('/savequestion', (req, res) => {
    let tittle = req.body.tittle
    let description = req.body.description
    Question.create({
        tittle: tittle,
        description: description
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/question/:id', (req, res) => {
    let id = req.params.id
    Question.findOne({
        where: { id: id}
    }).then(question => {
        if (question != undefined) {
            Answer.findAll({
                where: { questionId: question.id },
                order: [[ 'id', 'DESC' ]]
            }).then(answers => {
                res.render('question', {
                    question: question,
                    answers: answers
                })
            })
        } else {
            res.redirect('/')
        }
    })
})

app.post('/reply', (req, res) => {
    let body = req.body.body
    let questionId = req.body.questionId

    Answer.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect(`/question/${questionId}`)
    })
})

app.listen(8080, () => {
    console.log('Servidor iniciado!')
})