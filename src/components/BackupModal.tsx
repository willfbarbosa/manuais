import React, { useRef, useState } from 'react';
import { X, HardDriveDownload, Upload, RefreshCw, CheckCircle2, AlertTriangle, Smartphone, Cloud, ArrowRight } from 'lucide-react';
import { exportManualsJSON, importManualsJSON, resetToInitialManuals, getStoredManuals, getStoredBrands, getStoredCategories } from '../utils/storage';
import { Manual, BrandItem, CategoryItem } from '../types/manual';
import { isTursoConfigured, syncAllLocalToTurso } from '../lib/turso';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: (data: { manuals: Manual[]; brands: BrandItem[]; categories: CategoryItem[] }) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataUpdated
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSyncTurso = async () => {
    setIsSyncing(true);
    setStatusMsg(null);
    try {
      const manuals = getStoredManuals();
      const brands = getStoredBrands();
      const categories = getStoredCategories();
      const ok = await syncAllLocalToTurso(manuals, brands, categories);
      if (ok) {
        setStatusMsg({ type: 'success', text: `Sucesso! Todos os ${manuals.length} manuais, marcas e categorias do seu PC foram enviados para o Banco Turso na nuvem!` });
      } else {
        setStatusMsg({ type: 'error', text: 'Não foi possível enviar para o Turso DB. Verifique se as variáveis de ambiente foram aplicadas na Vercel e faça um novo Deploy.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Erro ao conectar ao Turso DB. Verifique as credenciais.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = () => {
    exportManualsJSON();
    setStatusMsg({ type: 'success', text: 'Backup exportado com sucesso! Envie o arquivo salvo para o seu celular e clique em Importar.' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const updatedData = importManualsJSON(content);
          onDataUpdated(updatedData);
          setStatusMsg({ type: 'success', text: `Sincronização concluída! ${updatedData.manuals.length} manuais, ${updatedData.brands.length} marcas e ${updatedData.categories.length} categorias importados.` });
        } catch (err) {
          setStatusMsg({ type: 'error', text: 'Falha ao importar. Verifique se o arquivo selecionado é um JSON válido.' });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja restaurar os padrões de fábrica da Eletrozone? Todos os dados locais serão redefinidos.')) {
      const initial = resetToInitialManuals();
      onDataUpdated(initial);
      setStatusMsg({ type: 'success', text: 'Base de manuais, marcas e categorias redefinida para os padrões!' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-modal my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Sincronização & Backup de Manuais
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                manuais.eletrozone.net.br
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

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Cloud Status */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Cloud className="w-4 h-4 text-red-500" />
                Status da Conexão em Nuvem (Turso DB)
              </span>
              {isTursoConfigured() ? (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Conectado (Nuvem Ativa)
                </span>
              ) : (
                <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700">
                  Modo Local / Dispositivo
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {isTursoConfigured()
                ? 'Seu banco de dados em nuvem está ativo! Os manuais são sincronizados automaticamente em todos os celulares e computadores.'
                : 'Você está no modo de armazenamento local do navegador. Para enviar os 10 manuais do computador para o celular, siga o passo a passo abaixo.'}
            </p>
            {isTursoConfigured() && (
              <div className="pt-2">
                <button
                  onClick={handleSyncTurso}
                  disabled={isSyncing}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Cloud className="w-4 h-4" />
                  {isSyncing ? 'Sincronizando com Banco Turso...' : 'Enviar Manuais deste PC para a Nuvem (Turso)'}
                </button>
              </div>
            )}
          </div>

          {/* Transfer Step by Step Box */}
          <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-red-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> Como Enviar os 10 Manuais para o Celular:
            </h3>
            <ol className="text-xs text-zinc-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>No <strong>Computador</strong>: Clique em <strong>Exportar Backup (JSON)</strong> abaixo.</li>
              <li>Envie o arquivo baixado (<code>eletrozone_manuais_backup.json</code>) para o seu celular via <strong>WhatsApp, Email ou Drive</strong>.</li>
              <li>No <strong>Celular</strong>: Acesse <code>manuais.eletrozone.net.br</code>, abra este menu de Backup e clique em <strong>Importar Backup</strong>.</li>
            </ol>
          </div>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">1. Exportar Backup (Computador)</h3>
                <p className="text-[11px] text-zinc-400">Baixe o arquivo de backup com os 10 manuais.</p>
              </div>
              <button
                onClick={handleExport}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                Exportar JSON
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">2. Importar Backup (No Celular)</h3>
                <p className="text-[11px] text-zinc-400">Selecione o arquivo JSON no celular para carregar os manuais.</p>
              </div>
              <label className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-red-400" />
                Importar JSON
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-red-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-red-400">Restaurar Padrões Eletrozone</h3>
                <p className="text-[11px] text-zinc-400">Recarregar base limpa original.</p>
              </div>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resetar
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
