require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");


const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

// // Função para buscar aniversariantes no Wikipedia
// async function getFamousBirthdays(month, day) {
//     const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`;

//     try {
//         const response = await axios.get(url);
//         const people = response.data.births.slice(0, 5).map(person => ({
//             name: person.text,
//             year: person.year,
//             description: person.pages[0]?.description || "No description"
//         }));
//         return people;
//     } catch (error) {
//         console.error('Erro ao buscar aniversariantes:', error.message);
//         return [];
//     }
// }


app.post('/', async (req, res) => {
    const prompt = req.body?.prompt?.text;
  
    if (!prompt) {
      return res.status(400).json({ error: "Prompt ausente" });
    }
  
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "mistralai/mixtral-8x7b-instruct", // ou "openai/gpt-3.5-turbo" se quiser
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      const output = response.data.choices[0].message.content;
  
      res.json({
        candidates: [{ output }]
      });
  
    } catch (err) {
      console.error("Erro OpenRouter:", err.message);
      res.status(500).json({ error: "Erro ao consultar OpenRouter" });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`✅ Backend rodando em http://localhost:${PORT}`);
  });


// // Rota principal
// app.get('/', async (req, res) => {
//     const today = new Date();
//     const month = today.getMonth() + 1; // meses começam em 0
//     const day = today.getDate();

//     const birthdays = await getFamousBirthdays(month, day);
//     res.json(birthdays);
// });

// app.get('/aniversariantes', async (req, res) => {
//     const dateParam = req.query.date;
//     const date = dateParam ? new Date(dateParam) : new Date();
//     const month = date.getMonth() + 1;
//     const day = date.getDate();

//     const birthdays = await getFamousBirthdays(month, day);
//     res.json(birthdays);
// });

// app.listen(PORT, () => {
//     console.log(`Servidor rodando em http://localhost:${PORT}`);
// });