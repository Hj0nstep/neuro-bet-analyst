require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const TelegramBot = require('node-telegram-bot-api');

// Importa o módulo de dados (Arquitetura Limpa)
const { limparTexto, buscarTime, buscarGradeHoje } = require('./dadosFutebol');

// Configurações
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Modelo definido para a versão estável
// Nota: Se der erro 429/404, é necessário trocar a API KEY por uma nova
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log("🚀 NEUROBET ONLINE - SISTEMA MODULAR ATIVO");

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const texto = msg.text;
    if (!texto) return;

    bot.sendChatAction(chatId, 'typing');

    try {
        // 1. Limpeza e Identificação do Termo
        const termo = limparTexto(texto);
        console.log(`📩 Input: "${texto}" | 🔍 Busca: "${termo}"`);

        let dadosParaIA = "";

        // 2. Lógica de Busca (Específica ou Geral)
        if (termo.length > 2) {
            // Tenta achar o time (com prioridade para times BR)
            const resultadoTime = await buscarTime(termo);
            if (resultadoTime) {
                dadosParaIA = resultadoTime;
            } else {
                // Se não achar time, busca grade geral
                dadosParaIA = await buscarGradeHoje();
            }
        } else {
            // Se o termo for vazio (ex: "jogos hoje"), busca grade geral
            dadosParaIA = await buscarGradeHoje();
        }

        // 3. Prompt para a IA
        const prompt = `
        Aja como o NeuroBet (Analista Profissional de Apostas).
        
        CONTEXTO DE DADOS REAIS (API SPORTS):
        ${dadosParaIA}
        ---------------------------------------
        
        PERGUNTA DO USUÁRIO: "${texto}"
        
        DIRETRIZES:
        - Se for sobre o PASSADO (último jogo), informe o placar exato e data.
        - Se for sobre o FUTURO (próximo jogo), informe data e hora.
        - Se não houver dados, explique que sua base é de jogos oficiais recentes/próximos.
        - Seja direto, técnico e motivador.
        `;

        const result = await model.generateContent(prompt);
        await bot.sendMessage(chatId, result.response.text());

    } catch (error) {
        console.error("❌ Erro:", error.message);
        bot.sendMessage(chatId, "⚠️ Ocorreu uma falha técnica na comunicação com a IA. Tente novamente mais tarde.");
    }
});