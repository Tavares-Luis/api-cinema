import express from 'express';

const app = express();
app.use(express.json())



app.get('/livro', (req, res) => {
  return res.status(200).send({
    message: 'todos os livros'
  })
});

app.get('/livro/:id', (req, res) => {
  return res.status(200).send({
    livro: req.params.idLivro,
  });
});

app.post('/livro', (req, res) => {
  const { nome, idade } = req.body

  return res.status(200).send(`Nome: ${nome} e tenho: ${idade} anos`)
});


app.listen('3131', (e) => {
  if (e) {
    return console.log(e);
  } else {
    console.log(`api rodando na http://localhost:3131`);
  }
})