# 🧠 NeuroBet Analyst Bot

Um assistente de apostas esportivas inteligente para Telegram, alimentado por Inteligência Artificial (Google Gemini) e Dados de Futebol em Tempo Real (API-Sports).

## 🚀 Funcionalidades

- **🤖 IA Personalizada:** O bot atua como "NeuroBet", um analista frio e calculista focado em gestão de banca e mindset.
- **⚽ Dados Reais:** Integração com a API-Sports para buscar resultados e calendários atualizados.
- **🔍 Busca Inteligente por Time:**
  - Identifica times automaticamente (ex: "Corinthians", "Real Madrid").
  - **Prioridade Brasil:** Algoritmo inteligente que prioriza times brasileiros em caso de nomes duplicados.
  - Traz o **Último Resultado** (passado) e o **Próximo Jogo** (futuro).
- **📅 Grade Diária:** Se o usuário pedir "jogos de hoje", o bot lista os principais confrontos do dia.
- **🛡️ Tratamento de Erros:** Sistema robusto contra falhas de digitação e gírias (ex: "ql jogo do fla hj").

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução.
- **node-telegram-bot-api**: Integração com o Telegram.
- **Google Gemini AI (1.5 Flash)**: Cérebro para geração de respostas e análises.
- **Axios**: Requisições HTTP para a API de futebol.
- **Dotenv**: Gerenciamento de variáveis de ambiente.

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.
- Conta no Telegram (para criar o bot via BotFather).
- Chave de API do Google AI Studio.
- Chave de API do API-Sports (Gratuita).

### Instalação

1. Clone o repositório:
   ```bash
   git clone [https://github.com/Hj0nstep/neuro-bet-analyst.git](https://github.com/Hj0nstep/neuro-bet-analyst.git)
   cd neuro-bet-analyst