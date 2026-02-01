// ARQUIVO: dadosFutebol.js
// Responsável por buscar dados reais e limpar o texto do usuário.

require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.FOOTBALL_API_KEY;
const API_URL = 'https://v3.football.api-sports.io';
const HEADERS = { 'x-rapidapi-key': API_KEY };

// --- FUNÇÃO 1: FAXINEIRA DE TEXTO ---
function limparTexto(texto) {
    if (!texto) return "";
    let limpo = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    limpo = limpo.replace(/[?!.,]/g, " ");
    
    // Palavras que não servem para a busca
    const lixo = [
        "qual", "foi", "o", "ultimo", "resultado", "do", "jogo", "contra", 
        "quem", "placar", "quanto", "ficou", "tem", "hoje", "analise", 
        "pro", "pra", "de", "no", "na", "me", "diga", "saber", "time", "clube", "jogos"
    ];
    
    lixo.forEach(p => limpo = limpo.replace(new RegExp(`\\b${p}\\b`, 'g'), " "));
    return limpo.replace(/\s+/g, " ").trim();
}

// --- FUNÇÃO 2: BUSCA DADOS DE UM TIME ESPECÍFICO ---
async function buscarTime(nomeTime) {
    if (!API_KEY) return "Erro: Sem chave de API configurada.";
    
    try {
        console.log(`🔎 Buscando time: "${nomeTime}"`);
        const busca = await axios.get(`${API_URL}/teams`, { headers: HEADERS, params: { search: nomeTime } });
        
        if (busca.data.results === 0) return null;

        // Prioridade Brasil
        let time = busca.data.response.find(t => t.team.country === "Brazil");
        if (!time) time = busca.data.response[0]; // Se não for BR, pega o primeiro (ex: Real Madrid)

        const id = time.team.id;
        const nome = time.team.name;
        
        // Busca Último e Próximo Jogo em paralelo (mais rápido)
        const [ultimoReq, proximoReq] = await Promise.all([
            axios.get(`${API_URL}/fixtures`, { headers: HEADERS, params: { team: id, last: 1, status: 'FT' } }),
            axios.get(`${API_URL}/fixtures`, { headers: HEADERS, params: { team: id, next: 1 } })
        ]);

        let relatorio = `📊 DADOS DO TIME: ${nome} (${time.team.country})\n\n`;

        // Último jogo
        if (ultimoReq.data.results > 0) {
            const u = ultimoReq.data.response[0];
            relatorio += `🔙 ÚLTIMO JOGO (${u.fixture.date.split('T')[0]}):\n${u.teams.home.name} ${u.goals.home}-${u.goals.away} ${u.teams.away.name}\n\n`;
        }

        // Próximo jogo
        if (proximoReq.data.results > 0) {
            const p = proximoReq.data.response[0];
            const data = p.fixture.date.split('T')[0];
            const hora = p.fixture.date.split('T')[1].slice(0, 5);
            relatorio += `🔜 PRÓXIMO: ${p.teams.home.name} x ${p.teams.away.name}\n📅 ${data} às ${hora}\n🏆 ${p.league.name}`;
        } else {
            relatorio += "ℹ️ Sem jogos agendados.";
        }

        return relatorio;

    } catch (e) {
        console.error("Erro na busca de time:", e.message);
        return null;
    }
}

// --- FUNÇÃO 3: GRADE GERAL DE HOJE ---
async function buscarGradeHoje() {
    if (!API_KEY) return "Erro: Sem chave de API.";

    try {
        const hoje = new Date().toISOString().split('T')[0];
        console.log(`📡 Buscando grade geral de: ${hoje}`);
        
        const response = await axios.get(`${API_URL}/fixtures`, { headers: HEADERS, params: { date: hoje } });
        
        // Filtra principais ligas ou jogos do Brasil
        const ligasTop = ["Serie A", "Serie B", "Premier League", "La Liga", "Bundesliga", "Libertadores"];
        let jogos = response.data.response.filter(j => 
            j.league.country === "Brazil" || ligasTop.some(l => j.league.name.includes(l))
        );

        if (jogos.length === 0) jogos = response.data.response.slice(0, 10); // Fallback

        let resumo = `JOGOS DE HOJE (${hoje}):\n`;
        jogos.slice(0, 15).forEach(j => {
            const hora = j.fixture.date.split('T')[1].slice(0, 5);
            resumo += `- ${hora}: ${j.teams.home.name} x ${j.teams.away.name}\n`;
        });
        return resumo;

    } catch (e) {
        return "Erro ao buscar grade de hoje.";
    }
}

// Exporta as funções para o index.js poder usar
module.exports = { limparTexto, buscarTime, buscarGradeHoje };