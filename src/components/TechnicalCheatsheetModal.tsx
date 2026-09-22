import React, { useState } from 'react';
import { X, Wrench, Cpu, Zap, Key, HardDrive, Copy, Check } from 'lucide-react';

interface TechnicalCheatsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalCheatsheetModal: React.FC<TechnicalCheatsheetModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'motors' | 'motherboards' | 'access' | 'alarm'>('motors');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-modal my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Guia Técnico & Cheatsheet de Bancada
                <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded font-mono border border-red-500/30">
                  Eletrozone Field Guide
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Pinouts, códigos de jumper, padrões IP e esquemas de bancada rápida
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-4 bg-zinc-950/50 border-b border-zinc-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('motors')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'motors'
                ? 'border-red-500 text-red-400 bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Motores de Portão (PPA/Peccinin/Garen)
          </button>

          <button
            onClick={() => setActiveTab('motherboards')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'motherboards'
                ? 'border-red-500 text-red-400 bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-red-400" />
            Placas Mãe (Asus Front Panel)
          </button>

          <button
            onClick={() => setActiveTab('access')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'access'
                ? 'border-red-500 text-red-400 bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            Controle de Acesso (Intelbras/IPEC)
          </button>

          <button
            onClick={() => setActiveTab('alarm')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'alarm'
                ? 'border-red-500 text-red-400 bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            Automação & Alarmes (JFL)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {activeTab === 'motors' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Procedimentos de Programação Rápida - Automatizadores
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PPA Card */}
                <div className="bg-zinc-950 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase font-mono">PPA - Central Agility / Pop</span>
                    <button
                      onClick={() => copyToClipboard('1. Jumper PROG em ON\n2. Pressione TX\n3. Pressione GRV')}
                      className="text-xs text-zinc-400 hover:text-amber-300"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <ol className="text-xs text-zinc-300 space-y-1.5 list-decimal pl-4">
                    <li>Coloque o jumper <strong>PROG</strong> na posição <strong>ON</strong>.</li>
                    <li>Pressione o botão do controle remoto desejado.</li>
                    <li>O LED piscará rápido. Pressione o botão <strong>GRV</strong> na placa.</li>
                    <li>Para apagar percurso: Mantenha GRV pressionado por 10s.</li>
                  </ol>
                </div>

                {/* Peccinin Card */}
                <div className="bg-zinc-950 p-4 rounded-2xl border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 uppercase font-mono">Peccinin - Central CP4000</span>
                    <button
                      onClick={() => copyToClipboard('1. Pressione LEARN\n2. Pressione TX\n3. LED acende fixo')}
                      className="text-xs text-zinc-400 hover:text-blue-300"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <ol className="text-xs text-zinc-300 space-y-1.5 list-decimal pl-4">
                    <li>Pressione a tecla <strong>LEARN</strong>. O LED acenderá.</li>
                    <li>Pressione a tecla do controle remoto Rolling Code.</li>
                    <li>O LED piscará indicando recepção. Pressione LEARN novamente.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'motherboards' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-500" />
                Pinout do Painel Frontal Asus & Placas Mãe
              </h3>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4">
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 code-font text-xs text-red-300">
                  <p className="font-bold text-white mb-2">Conector F_PANEL (10-1 Pinos):</p>
                  <pre className="text-[11px] leading-relaxed">
{` +---+---+---+---+---+
 | 2 | 4 | 6 | 8 |NC |  (PWR_SW | RESET_SW)
 +---+---+---+---+---+
 | 1 | 3 | 5 | 7 | 9 |  (PLED   | HDLED)
 +---+---+---+---+---+

Pinos 2 + 4 = Botão Ligar/Desligar (Power Switch)
Pinos 6 + 8 = Botão Reiniciar (Reset Switch)
Pinos 1(+) e 3(-) = LED de Ligado (PLED)
Pinos 5(+) e 7(-) = LED do HD (HDLED)`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                Controle de Acesso Intelbras & Receptores IPEC
              </h3>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3 text-xs text-zinc-300">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="font-bold text-emerald-400">Padrões de IP Intelbras Facial / Biometria:</span>
                  <span className="code-font bg-zinc-900 px-2 py-0.5 rounded text-red-300">192.168.1.201</span>
                </div>
                <p><strong>Usuário Padrão:</strong> admin</p>
                <p><strong>Senha Padrão:</strong> admin ou admin123 (requer troca no primeiro acesso)</p>
                <p><strong>Conexão Fechadura Eletroímã:</strong> Conectar em LOCK_NC e LOCK_COM com diodo de proteção 1N4007 em paralelo com a bobina.</p>
              </div>
            </div>
          )}

          {activeTab === 'alarm' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                Tabela de Resistores de Zonas JFL
              </h3>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3 text-xs text-zinc-300">
                <p><strong>Zona Simples:</strong> Resistor 2K2 em série no borne Z e COM.</p>
                <p><strong>Duplicação de Zonas com Reconhecimento de Tamper:</strong></p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-zinc-400 text-[11px]">
                  <li>Zona Baixa: Resistor de 2.2K Ohms</li>
                  <li>Zona Alta: Resistor de 3.3K Ohms</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
