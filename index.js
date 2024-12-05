const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const moment = require('moment'); // Подключаем библиотеку moment
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Замените на ваш пароль
    database: 'test'    // Замените на вашу базу данных
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключено к базе данных MySQL');
});

// Эндпоинт для получения всех клиентов
app.post('/api', (req, res) => {
    db.query(req.body.query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Ошибка выполнения запроса', err });
        } else {
            console.log(results);
            const transformedData = () => results.map(client => {
              if (client.start_date || client.end_date) {
                return {
                    ...client,
                    start_date: moment(client.start_date).format('YYYY-MM-DD'),  // Преобразуем дату
                    end_date: moment(client.end_date).format('YYYY-MM-DD')      // Преобразуем дату
                };
              }
              else if (client.date) {
                return {
                    ...client,
                    date: moment(client.date).format('YYYY-MM-DD')
                };
              }
              else {
                return client;
              }
            });

            res.json({
                success: true,
                data: Array.isArray(results) ? transformedData() : results
            });
        }
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
