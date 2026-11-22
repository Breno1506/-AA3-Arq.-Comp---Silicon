# SILICON // Arquitetura em Silício

> Jogo interativo de palavras cruzadas e quiz técnico desenvolvido para treinar e revisar os conceitos fundamentais de **Arquitetura Computacional**[cite: 1].

[![HTML5](https://img.shields.io/badge/HTML5-Puro-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Moderno-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)

## Link do Site Publicado

Acesse a versão online do projeto:

`https://SEU-USUARIO.github.io/arqcomp-cruzadinha/`

---

## Sobre o Projeto

Este projeto foi criado para a atividade avaliativa da disciplina de **Arquitetura Computacional**[cite: 1]. A proposta une revisão teórica com uma interface inspirada em **placas de circuito impresso (PCB)** e **arquitetura de processadores**, tornando o estudo mais visual, dinâmico e interativo[cite: 1].

### Principais Funcionalidades

* **Tela Inicial Interativa:** Portal de entrada com soquete de CPU interativo, acesso direto ao manual de termos e troca de paletas de cor da placa (**PCB Verde**, **Blueprint**, **Âmbar** e **Ultravioleta**).
* **Cruzadinha de 14 Palavras:** Tabuleiro cruzado construído em grade interativa com digitação direta nas casas, navegação por teclado e pistas organizadas em **Horizontais** e **Verticais**[cite: 1, 2].
* **Validação e Feedback Visual:** Botão **Conferir** com destaque visual para acertos e erros, contador de progresso (`X de 14 palavras`), dica de letra e botão **Reiniciar**[cite: 2].
* **Quiz de Arquitetura Computacional:** Modo de perguntas com cronômetro, pontuação, sequência de acertos e explicações técnicas ao final de cada questão.
* **Trilhas e Efeitos Sonoros:** Canvas animado com trilhas de circuito e suporte a áudio para tornar a navegação mais imersiva.

---

## Como Jogar

### Na Cruzadinha
1. Clique em uma casa do tabuleiro ou selecione uma pista nas colunas **Horizontais** ou **Verticais**[cite: 2].
2. Digite as letras diretamente nas casas (em letras maiúsculas, sem acentos e sem espaços)[cite: 1].
3. Use as **setas do teclado** para mover o cursor, **Espaço** para alternar entre horizontal e vertical, **D** para revelar uma letra e **Enter** para conferir.
4. Clique em **Conferir** para atualizar o contador de acertos e verificar quais palavras estão corretas, ou em **Reiniciar** para limpar o tabuleiro[cite: 2].

### No Quiz de Arquitetura Computacional
1. Acesse a aba **02. QUIZ ARQCOMP (12)** no topo da tela.
2. Responda às questões dentro do tempo limite para acumular pontos e manter sua sequência de acertos.
3. Leia a explicação técnica exibida após cada resposta para reforçar o conceito.

---

## Palavras e Pistas Utilizadas[cite: 2]

### Horizontais[cite: 2]
1. **MICROCONTROLADOR** — Chip completo com processador, memória e portas de entrada e saída integrados.
6. **ULA** — Parte do processador responsável pelos cálculos matemáticos e testes lógicos.
7. **DMA** — Recurso que permite periféricos transferirem dados à memória sem sobrecarregar o processador.
9. **REGISTRADORES** — Pequenas unidades de armazenamento interno mais rápidas que existem dentro do processador.
11. **FLASH** — Memória não volátil regravável em blocos, muito usada em pendrives e SSDs.
12. **DATABUS** — Via bidirecional por onde trafegam as informações entre processador, memória e periféricos.
14. **DUALCORE** — Processador que possui dois núcleos físicos trabalhando em conjunto no mesmo chip.

### Verticais[cite: 2]
2. **MEMORIADEMASSA** — Armazenamento secundário não volátil de grande capacidade, como HD ou SSD.
3. **CACHE** — Memória ultrarrápida próxima ao processador que guarda dados acessados com frequência.
4. **ROM** — Memória não volátil apenas de leitura que guarda instruções básicas de inicialização.
5. **RAM** — Memória principal volátil de acesso aleatório usada durante a execução de programas.
8. **ADDRESSBUS** — Via unidirecional que transporta a localização física de onde ler ou gravar dados.
10. **QUADCORE** — Processador equipado com quatro núcleos físicos independentes para executar tarefas simultâneas.
13. **CPU** — Cérebro do computador que busca, decodifica e executa as instruções dos programas.

---

## Estrutura do Repositório

```text
arqcomp-cruzadinha/
├── index.html
├── style.css
├── script.js
└── README.md
```[cite: 2]
