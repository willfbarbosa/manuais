-- Schema de Banco de Dados SQLite / Turso (libSQL) para Eletrozone Manuais
-- Domínio: manuais.eletrozone.net.br

CREATE TABLE IF NOT EXISTS manuals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT,
  description TEXT,
  file_size TEXT,
  file_type TEXT DEFAULT 'PDF',
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  updated_at TEXT,
  wiring_diagram_notes TEXT,
  jumper_settings TEXT,
  tags TEXT,
  download_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#ef4444'
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'Zap'
);

-- Marcas Iniciais Homologadas Eletrozone
INSERT OR IGNORE INTO brands (id, name, description, color) VALUES
('ppa', 'PPA', 'Automatizadores de Portão, Centrais JetFlex & Barreiras', '#f59e0b'),
('peccinin', 'Peccinin', 'Motores Deslizantes, Basculantes & Centrais CP', '#3b82f6'),
('jfl', 'JFL', 'Centrais de Alarme, Automação Smart & Receptores', '#ef4444'),
('intelbras', 'Intelbras', 'Controle de Acesso Biométrico, Câmeras & Interfonia', '#10b981'),
('asus', 'Asus', 'Placas Mãe Hardware, Servidores & Bios Cheatsheet', '#dc2626'),
('ipec', 'IPEC', 'Módulos Relé de Automação, Receptores & Fechaduras', '#f97316'),
('garen', 'Garen', 'Automatizadores de Portão & Centrais Wave', '#a855f7'),
('rossi', 'Rossi', 'Motores Rossi Nitro, Centrais de Comando VK', '#f43f5e');

-- Categorias Iniciais Homologadas Eletrozone
INSERT OR IGNORE INTO categories (id, name, description, icon_name) VALUES
('cat-motor', 'Motor de Portão', 'Automatizadores para portão deslizante, basculante e pivô', 'Zap'),
('cat-placa', 'Placa Mãe', 'Placas de computador, circuitos mãe e módulos principais', 'Cpu'),
('cat-acesso', 'Controle de Acesso', 'Leitores biométricos, faciais, fechaduras e botoeiras', 'Key'),
('cat-automacao', 'Automação', 'Módulos relé, receptores, automação residencial e predial', 'HardDrive'),
('cat-seguranca', 'Segurança & Alarmes', 'Centrais de alarme, cercas elétricas e sensores', 'Shield');
