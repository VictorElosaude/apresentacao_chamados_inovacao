// server.js
// Este é o arquivo principal do seu servidor Node.js.

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const lockfile = require('proper-lockfile');

const app = express();
const port = 3000;

// Agora que sabemos a sua estrutura de pastas, a variável FRONTEND_DIR
// precisa apontar para a pasta que está UM NÍVEL ACIMA (a pasta pai)
// do diretório onde está o 'server.js'.
// '__dirname' é a pasta onde o 'server.js' está (elosaude-backend).
// 'path.join(__dirname, '..')' vai para a pasta acima (a raiz do projeto).
const VAGAS_FILE = path.join(__dirname, '..', 'vagas.json');
const FRONTEND_DIR = path.join(__dirname, '..');

app.use(express.json());
app.use(express.static(FRONTEND_DIR));

// ------------------------------------------------------------------
// INÍCIO: Adição de código para servir a página inicial
// ------------------------------------------------------------------
// Esta é a rota que faltava no seu servidor.
// Ela garante que, quando alguém acessa o seu site pelo link principal (http://...),
// o servidor irá enviar o arquivo 'index.html' para o navegador.
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});
// ------------------------------------------------------------------
// FIM: Adição de código para servir a página inicial



// Rota para manipular a inscrição
app.post('/inscrever', async (req, res) => {
    const { nome, setor, assunto } = req.body;

    if (!nome || !setor || !assunto) {
        return res.status(400).send('Dados incompletos.');
    }

    let release;
    try {
        // 1. Bloqueia o arquivo para escrita
        release = await lockfile.lock(VAGAS_FILE, { retries: 5 });

        // 2. Lê o conteúdo atual do arquivo
        const data = await fs.readFile(VAGAS_FILE, 'utf8');
        const vagasData = JSON.parse(data);

        // 3. Verifica se ainda há vagas
        if (vagasData.vagas_disponiveis <= 0) {
            return res.status(409).send('Todas as vagas foram preenchidas.');
        }

        // 4. Atualiza os dados
        vagasData.vagas_disponiveis -= 1;
        vagasData.inscricoes.push({
            nome,
            setor,
            assunto,
            data_inscricao: new Date().toISOString()
        });

        // 5. Salva o arquivo atualizado
        await fs.writeFile(VAGAS_FILE, JSON.stringify(vagasData, null, 2), 'utf8');

        // 6. Responde ao cliente com sucesso
        res.status(200).send('Inscrição realizada com sucesso!');

    } catch (error) {
        console.error('Erro na inscrição:', error);
        res.status(500).send('Erro interno do servidor ao processar a inscrição.');
    } finally {
        // 7. Garante que o arquivo seja desbloqueado
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