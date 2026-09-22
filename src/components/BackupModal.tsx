import React, { useRef, useState } from 'react';
import { X, HardDriveDownload, Upload, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { exportManualsJSON, importManualsJSON, resetToInitialManuals } from '../utils/storage';
import { Manual, BrandItem, CategoryItem } from '../types/manual';

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

  if (!isOpen) return null;

  const handleExport = () => {
    exportManualsJSON();
    setStatusMsg({ type: 'success', text: 'Backup exportado com sucesso contendo manuais, marcas e categorias!' });
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
          setStatusMsg({ type: 'success', text: `Restauração concluída! ${updatedData.manuals.length} manuais, ${updatedData.brands.length} marcas e ${updatedData.categories.length} categorias carregados.` });
        } catch (err) {
          setStatusMsg({ type: 'error', text: 'Falha ao importar. Verifique se o arquivo é um JSON válido.' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-modal">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Backup & Exportação Geral
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
        <div className="p-6 space-y-4">
          
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

          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">Exportar Base (JSON)</h3>
                <p className="text-[11px] text-zinc-400">Baixe manuais, marcas e categorias cadastradas.</p>
              </div>
              <button
                onClick={handleExport}
                className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-xl border border-red-500/40 transition-all flex items-center gap-1.5 shrink-0"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                Exportar
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">Importar Backup de Dados</h3>
                <p className="text-[11px] text-zinc-400">Restaure dados salvos anteriormente.</p>
              </div>
              <label className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-red-400" />
                Importar
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
                <p className="text-[11px] text-zinc-400">Recarregar os manuais, marcas e categorias originais.</p>
              </div>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/30 transition-all flex items-center gap-1.5 shrink-0"
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
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
