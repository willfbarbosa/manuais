import { Manual } from '../types/manual';

export const INITIAL_MANUALS: Manual[] = [
  {
    id: 'ppa-dz-rio-500',
    title: 'Manual Técnico Motor de Portão Dz Rio 500 Fast',
    brand: 'PPA',
    category: 'Motor de Portão',
    model: 'Dz Rio 500 JetFlex / Pop',
    version: 'Rev 3.4 - Central Agility',
    description: 'Manual de instalação física, programação de percurso, gravação de controles 433.92MHz e configuração de embreagem eletrônica para automatizador de portão deslizante PPA Dz Rio.',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: '/images/motor_ppa_dzrio.jpg',
    updatedAt: '2026-09-10',
    tags: ['Motor Deslizante', 'PPA', 'JetFlex', 'Percurso', 'Agility', 'Portão'],
    downloadCount: 342,
    wiringDiagramNotes: `### Esquema de Ligação - Central PPA Pop/Agility:
- **U, V, W:** Conexão do motor elétrico trifásico/monofásico
- **CAP:** Capacitor de partida (12uF a 25uF conforme o motor)
- **FCA / FCF:** Sensores de Fim de Curso Análogo / Reed Switch
- **BOT:** Entrada para Botoeira (GND + BOT)
- **FOT:** Fotocélula de segurança (+12V, GND, NO, COM)
- **PROG:** Jumper de programação de Tx e tempo de pausa

### Programação Rápida de Controle (Tx):
1. Coloque o jumper **PROG** na posição ON.
2. Pressione a tecla do controle remoto desejado.
3. O LED da placa piscará rápido. Pressione o botão **GRV** na placa para confirmar.
4. Retire o jumper **PROG** para finalizar.`,
    jumperSettings: [
      { dip: 'PROG', function: 'Entra no modo de programação de controles e percurso', defaultVal: 'OFF' },
      { dip: 'PAUSA', function: 'Regula tempo de fechamento automático (0 a 120s)', defaultVal: 'Trimpot min' },
      { dip: 'EMB', function: 'Ajuste de força/anti-esmagamento eletrônico', defaultVal: 'Médio' }
    ]
  },
  {
    id: 'intelbras-ss-3530',
    title: 'Guia de Instalação e Configuração Controle de Acesso Biométrico SS 3530 MF',
    brand: 'Intelbras',
    category: 'Controle de Acesso',
    model: 'SS 3530 Facial & RFID',
    version: 'FW v2.1.0',
    description: 'Manual completo de instalação para controlador de acesso facial e cartão Mifare SS 3530 Intelbras. Diagramas Wiegand, conexões de fechadura eletroímã, sensor de porta e integração IP.',
    fileSize: '6.8 MB',
    fileType: 'PDF',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: '/images/intelbras_controle_acesso.jpg',
    updatedAt: '2026-09-15',
    tags: ['Controle de Acesso', 'Biometria', 'Intelbras', 'Facial', 'Wiegand', 'Fechadura'],
    downloadCount: 518,
    wiringDiagramNotes: `### Bornes de Ligação Traseira:
- **12V / GND:** Fonte de alimentação regulada 12VDC 2A
- **LOCK_NO / LOCK_COM / LOCK_NC:** Relé para acionamento de Fechadura Eletroímã ou Solenóide
- **SEN:** Sensor de estado da porta (Abertura/Arrombamento)
- **PUSH / GND:** Botão de saída de emergência (Botoeira NF/NA)
- **D0 / D1:** Comunicação Wiegand 26/34 bits para leitores escravos
- **ETH (RJ45):** Conexão IP de rede (Default: 192.168.1.201)

### Reset de Fábrica (Padrão Eletrozone):
Pressione e segure o botão de Reset no painel traseiro durante 10 segundos com o equipamento energizado até o LED piscar em cor Âmbar.`,
    jumperSettings: [
      { dip: 'TAMPER', function: 'Alarme sonoro ao remover do suporte de parede', defaultVal: 'HABILITADO' },
      { dip: 'WIEGAND', function: 'Seleção protocolo 26bits ou 34bits', defaultVal: '34 BITS' }
    ]
  },
  {
    id: 'asus-prime-b450m',
    title: 'Manual do Usuário e Tabela de Conectores Placa Mãe Asus Prime B450M-A II',
    brand: 'Asus',
    category: 'Placa Mãe',
    model: 'Prime B450M-A II / GAMING',
    version: 'Rev 1.02 Manual BR',
    description: 'Esquema detalhado dos conectores do painel frontal (F_PANEL), jumpers de Clear CMOS (CLRTC), slots de memória dual-channel DDR4 e atualização de BIOS USB FlashBack.',
    fileSize: '8.5 MB',
    fileType: 'PDF',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: '/images/asus_placa_mae.jpg',
    updatedAt: '2026-08-28',
    tags: ['Placa Mãe', 'Asus', 'B450M', 'Hardware', 'Pinout', 'BIOS', 'Power SW'],
    downloadCount: 890,
    wiringDiagramNotes: `### Diagrama do Painel Frontal (F_PANEL 10-1 pinos):
- **Pino 1 + 3:** Power LED (+ / -)
- **Pino 2 + 4:** Power Switch (PWR_BTN + GND) -> Botão Ligar/Desligar
- **Pino 5 + 7:** HDD LED (+ / -) -> Indicador de Disco
- **Pino 6 + 8:** Reset Switch (RESET + GND) -> Botão Reiniciar
- **Pino 9:** NC (Não Conectado)

### Procedimento Clear CMOS (Reset de BIOS):
1. Desligue a fonte e remova o cabo de força.
2. Curto-circuite os pinos **CLRTC** com uma chave de fenda por 5 a 10 segundos.
3. Conecte o cabo de força e ligue o computador. Pressione F1 para reconfigurar.`,
    jumperSettings: [
      { dip: 'CLRTC', function: 'Reset de configurações de CMOS / BIOS', defaultVal: 'Aberto (Normal)' },
      { dip: 'CPU_FAN', function: 'Controle PWM 4-Pinos ou DC 3-Pinos', defaultVal: 'Auto Detect' }
    ]
  },
  {
    id: 'jfl-active-32',
    title: 'Manual de Instalação e Programação Central de Alarme e Automação JFL Active 32 Duo',
    brand: 'JFL',
    category: 'Automação',
    model: 'Active 32 Duo / ME-05',
    version: 'Versão 4.0 Manual Técnico',
    description: 'Manual de configuração de zonas com resistor de fim de linha, saídas PGM para automação de lâmpadas e portões, aplicativo celular JFL Mob e protocolo de comunicação IP.',
    fileSize: '5.6 MB',
    fileType: 'PDF',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: '/images/jfl_automacao_central.jpg',
    updatedAt: '2026-09-02',
    tags: ['JFL', 'Automação', 'Central de Alarme', 'PGM', 'Zonas', 'Sensores'],
    downloadCount: 412,
    wiringDiagramNotes: `### Tabela de Resistores das Zonas:
- **Zona Simples com Fim de Linha:** Resistor 2.2K Ohms em série com o contato NF
- **Duplicação de Zona:** Zona Alta = Resistor 3.3K | Zona Baixa = Resistor 2.2K
- **Saídas PGM (Automação):** Saída de coletor aberto max 50mA 12VDC. Utilizar módulo relé externo para cargas de 110V/220V (como motores e iluminação).

### Comandos do Teclado de Programação:
- Entrar em programação: **[PROG] + Senha Master (Padrão: 5678)**
- Configurar IP: **[PROG] + [0] + [8] + [0] + Endereço IP**`,
    jumperSettings: [
      { dip: 'BOOT', function: 'Atualização de firmware via cabo serial/USB', defaultVal: 'Deshabilitado' },
      { dip: 'RESET', function: 'Restaura senha master de fábrica (0000)', defaultVal: 'Aberto' }
    ]
  },
  {
    id: 'peccinin-gatter-light',
    title: 'Manual de Instruções e Instalação Motor Peccinin Gatter Light 3000',
    brand: 'Peccinin',
    category: 'Motor de Portão',
    model: 'Gatter Light 3000 / CP 4000',
    version: 'Rev 2.8',
    description: 'Manual de operação do automatizador Peccinin Gatter com central eletrônica CP4000. Regulação de freio, fim de curso Reed e gravação de transmissores rolling code 433.92MHz.',
    fileSize: '3.9 MB',
    fileType: 'PDF',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: '/images/motor_ppa_dzrio.jpg',
    updatedAt: '2026-08-14',
    tags: ['Peccinin', 'Gatter', 'CP4000', 'Motor', 'Portão Deslizante', 'Rolling Code'],
    downloadCount: 295,
    wiringDiagramNotes: `### Conexões da Central CP 4000 Peccinin:
- **Rede 110V/220V:** Selecionar chave seletora de voltagem antes de energizar
- **Abertura/Fechamento (FCA/FCF):** Chaves fim de curso com conector rápido
- **Aprender TX:** Pressione o botão LEARN na placa, o LED acende. Pressione o botão do controle. O LED pisca confirmando.`,
    jumperSettings: [
      { dip: 'PAUSA', function: 'Fechamento automático ajustável no trimpot', defaultVal: 'Desativado' },
      { dip: 'FREIO', function: 'Ajuste de intensidade de parada do motor', defaultVal: 'Nível 2' }
    ]
  },
  {
    id: 'ipec-agility-rele',
    title: 'Manual de Instalação e Esquema Elétrico Módulo Relé & Receptor IPEC Agility',
    brand: 'IPEC',
    category: 'Automação',
    model: 'Receptor Agility 433MHz 2 Canais',
    version: 'Manual de Bancada 2026',
    description: 'Guia de ligação para módulos de automação IPEC, receptores multifunção 433MHz, retenção, pulso e temporização para acionamento de fechaduras, holofotes e portões.',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: '/images/jfl_automacao_central.jpg',
    updatedAt: '2026-09-19',
    tags: ['IPEC', 'Automação', 'Módulo Relé', 'Receptor 433MHz', 'Retenção', 'Pulso'],
    downloadCount: 184,
    wiringDiagramNotes: `### Modos de Funcionamento dos Jumpers IPEC:
- **Jumper JP1 Fechado (Modo Pulso):** O relé atua apenas enquanto o controle estiver pressionado (0.5s a 3s)
- **Jumper JP1 Aberto (Modo Retenção):** O relé altera o estado a cada clique do controle (Liga / Desliga)
- **Jumper JP2 Fechado (Modo Temporizado):** Relé ativado por tempo programável de 1s até 5 minutos.`,
    jumperSettings: [
      { dip: 'JP1', function: 'Modo Pulso (Fechado) vs Retenção / Latch (Aberto)', defaultVal: 'Fechado' },
      { dip: 'JP2', function: 'Temporizador de Relé para luz de garagem / fechadura', defaultVal: 'Aberto' }
    ]
  }
];
