const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const lockfile = require('proper-lockfile');

const app = express();
const port = 3000;

const VAGAS_FILE = path.join(__dirname, '..', 'vagas.json'); // Caminho para o arquivo vagas.json
const FRONTEND_DIR = path.join(__dirname, '..'); // Caminho para a raiz do seu projeto frontend

app.use(express.json());
app.use(express.static(FRONTEND_DIR));

// Rota para manipular a inscrição
app.post('/inscrever', async (req, res) => {
    const { nome, setor, email } = req.body; // Alterado para 'email'

    if (!nome || !setor || !email) { // Alterado para 'email'
        return res.status(400).send('Dados incompletos.');
    }

    let release;
    try {
        release = await lockfile.lock(VAGAS_FILE, { retries: 5 });
        const data = await fs.readFile(VAGAS_FILE, 'utf8');
        const vagasData = JSON.parse(data);

        if (vagasData.vagas_disponiveis <= 0) {
            return res.status(409).send('Todas as vagas foram preenchidas.');
        }

        vagasData.vagas_disponiveis -= 1;
        vagasData.inscricoes.push({
            nome,
            setor,
            email, // Alterado para 'email'
            data_inscricao: new Date().toISOString()
        });

        await fs.writeFile(VAGAS_FILE, JSON.stringify(vagasData, null, 2), 'utf8');
        res.status(200).send('Inscrição realizada com sucesso!');
    } catch (error) {
        console.error('Erro na inscrição:', error);
        res.status(500).send('Erro interno do servidor ao processar a inscrição.');
    } finally {
        if (release) {
            await release();
        }
    }
});

// Serve o arquivo vagas.json diretamente (para o frontend ler a contagem)
app.get('/vagas.json', async (req, res) => {
    try {
        const data = await fs.readFile(VAGAS_FILE, 'utf8');
        res.status(200).json(JSON.parse(data));
    } catch (error) {
        res.status(500).send('Erro ao ler o arquivo de vagas.');
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});