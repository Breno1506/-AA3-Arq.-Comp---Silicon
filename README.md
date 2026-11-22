# SILICON // Arquitetura em Silício

> Plataforma web interativa de estudos para **Arquitetura Computacional**, unindo uma **cruzadinha temática de 14 palavras** em layout de placa-mãe (PCB), um **quiz cronometrado de 12 questões** e um **manual técnico de 16 conceitos** — tudo desenvolvido em HTML5, CSS3 e JavaScript puro.

---

## Acesso Online

O projeto está publicado e pronto para jogar diretamente no navegador via GitHub Pages:

👉 **[Acessar SILICON // Arquitetura em Silício]([https://breno1506.github.io/-AA3-ArqComp/](https://breno1506.github.io/-AA3-Arq.-Comp---Silicon/))**

---

## Visão Geral do Projeto

O **SILICON** transforma a revisão de conteúdos de hardware e organização de computadores em uma experiência visual inspirada em **circuitos impressos (PCB)** e **soquetes de processadores**. A aplicação roda 100% no navegador sem dependências externas ou frameworks, contando com fundo animado em `<canvas>`, efeitos sonoros sintetizados via Web Audio API e 4 esquemas de cores alternáveis em tempo real.

### Principais Funcionalidades

* **Portal de Entrada Interativo:**
  * Fundo dinâmico em `<canvas>` com trilhas de circuito impresso e pulsos elétricos que reagem ao cursor e aos cliques.
  * Soquete de CPU interativo com variação simulada de clock (`GHz`).
  * Seletor instantâneo de 4 temas visuais: **PCB Verde**, **Blueprint**, **Âmbar** e **Ultravioleta**.
  * Acesso rápido ao **Manual Técnico dos 16 Termos** diretamente da tela inicial.

* **Cruzadinha de Arquitetura Computacional (14 Palavras):**
  * Layout tripartido com **Horizontais** à esquerda, **tabuleiro encaixado no soquete** ao centro (com casas vazias transparentes revelando o circuito) e **Verticais** à direita.
  * Preenchimento direto nas células com letras maiúsculas, navegação por setas, alternância de direção com `Espaço`, revelação de letra com `D` e validação rápida com `Enter`.
  * Botão **Conferir** com feedback visual imediato (verde para palavras completas corretas, vermelho para letras incorretas), contador de progresso (`X de 14 palavras`) e botão **Reiniciar**.

* **Quiz Técnico de Arquitetura Computacional (12 Questões):**
  * Perguntas sobre processador, hierarquia de memória, barramentos e sistemas embarcados.
  * Cronômetro de 20 segundos por questão, sistema de pontuação com bônus de tempo e multiplicador de sequência (`streak`), além de explicação técnica detalhada após cada resposta.

---

## Como Jogar

### 1. Cruzadinha
1. Na tela inicial, clique em **Entrar na Cruzadinha**.
2. Clique em qualquer célula ativa do tabuleiro ou selecione uma pista nas abas **Horizontais** ou **Verticais**.
3. Digite as respostas (sem acentos e sem espaços).
4. Utilize os atalhos de teclado para agilizar o preenchimento:
   * `Setas direcionais`: movem o cursor pelo tabuleiro.
   * `Espaço`: alterna entre direção horizontal e vertical em cruzamentos.
   * `D`: revela a letra da casa selecionada.
   * `Enter`: executa a conferência das palavras.
5. Clique em **Conferir** para validar as respostas e atualizar o placar, ou em **Reiniciar** para limpar toda a grade.

### 2. Quiz ArqComp
1. Clique em **Iniciar Quiz ArqComp** na tela inicial ou selecione a aba **02. QUIZ ARQCOMP (12)** no menu superior.
2. Leia o enunciado e escolha uma das 4 alternativas antes que o cronômetro de 20 segundos zere.
3. Confira a explicação técnica exibida abaixo das opções e clique em **Próxima Questão**.

---

## Gabarito e Pistas da Cruzadinha

### Horizontais
| Nº | Palavra | Pista |
| :-: | :--- | :--- |
| **1** | `MICROCONTROLADOR` | Chip completo com processador, memória e portas de entrada e saída integrados. |
| **6** | `ULA` | Parte do processador responsável pelos cálculos matemáticos e testes lógicos. |
| **7** | `DMA` | Recurso que permite periféricos transferirem dados à memória sem sobrecarregar o processador. |
| **9** | `REGISTRADORES` | Pequenas unidades de armazenamento interno mais rápidas que existem dentro do processador. |
| **11** | `FLASH` | Memória não volátil regravável em blocos, muito usada em pendrives e SSDs. |
| **12** | `DATABUS` | Via bidirecional por onde trafegam as informações entre processador, memória e periféricos. |
| **14** | `DUALCORE` | Processador que possui dois núcleos físicos trabalhando em conjunto no mesmo chip. |

### Verticais
| Nº | Palavra | Pista |
| :-: | :--- | :--- |
| **2** | `MEMORIADEMASSA` | Armazenamento secundário não volátil de grande capacidade, como HD ou SSD. |
| **3** | `CACHE` | Memória ultrarrápida próxima ao processador que guarda dados acessados com frequência. |
| **4** | `ROM` | Memória não volátil apenas de leitura que guarda instruções básicas de inicialização. |
| **5** | `RAM` | Memória principal volátil de acesso aleatório usada durante a execução de programas. |
| **8** | `ADDRESSBUS` | Via unidirecional que transporta a localização física de onde ler ou gravar dados. |
| **10** | `QUADCORE` | Processador equipado com quatro núcleos físicos independentes para executar tarefas simultâneas. |
| **13** | `CPU` | Cérebro do computador que busca, decodifica e executa as instruções dos programas. |

---

## Arquitetura e Tecnologias

* **HTML5:** Estruturação semântica das telas (portal inicial, estágio da cruzadinha, arena do quiz e modais de documentação e vitória).
* **CSS3:** Estilização modular com variáveis CSS (`:root` e `[data-pcb]`) para troca dinâmica de paletas, CSS Grid para o layout tripartido e responsividade completa.
* **JavaScript (ES6+):** Geração dinâmica da grade `16×16`, verificação cruzada de palavras, animação de partículas e trilhas em `<canvas>`, sintetizador de áudio via `AudioContext` e controle de estado do quiz.

### Estrutura de Arquivos

```text
-AA3-ArqComp/
├── index.html   # Estrutura da tela inicial, cruzadinha, quiz e modais
├── style.css    # Temas visuais (PCB, Blueprint, Âmbar, UV), grid e animações
├── script.js    # Lógica da cruzadinha, quiz, canvas PCB e efeitos sonoros
└── README.md    # Documentação completa do projeto
