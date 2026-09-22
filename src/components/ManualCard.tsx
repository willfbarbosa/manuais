import React from 'react';
import { Manual, ViewMode } from '../types/manual';
import { getBrandTheme } from '../utils/brandStyles';
import { FileText, Download, Eye, Wrench, Calendar, HardDrive, Edit3, Trash2, Tag, Cpu, Zap, Key, Shield } from 'lucide-react';

interface ManualCardProps {
  manual: Manual;
  viewMode: ViewMode;
  onViewPdf: (manual: Manual) => void;
  onViewSchematic: (manual: Manual) => void;
  onEdit: (manual: Manual) => void;
  onDelete: (id: string) => void;
  onDownload: (manual: Manual) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Motor de Portão':
      return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    case 'Placa Mãe':
      return <Cpu className="w-3.5 h-3.5 text-red-400" />;
    case 'Controle de Acesso':
      return <Key className="w-3.5 h-3.5 text-emerald-400" />;
    case 'Automação':
      return <HardDrive className="w-3.5 h-3.5 text-purple-400" />;
    default:
      return <Shield className="w-3.5 h-3.5 text-red-500" />;
  }
};

export const ManualCard: React.FC<ManualCardProps> = ({
  manual,
  viewMode,
  onViewPdf,
  onViewSchematic,
  onEdit,
  onDelete,
  onDownload
}) => {
  const brandTheme = getBrandTheme(manual.brand);

  if (viewMode === 'list') {
    return (
      <div className="glass-panel glass-panel-hover rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-800/90">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Image / Thumbnail */}
          <div className="w-16 h-16 rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800 shrink-0 relative group">
            <img
              src={manual.thumbnailUrl || '/images/motor_ppa_dzrio.jpg'}
              alt={manual.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-4 h-4 text-red-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${brandTheme.badgeBg}`}>
                {manual.brand}
              </span>
              <span className="bg-zinc-900 text-zinc-300 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 border border-zinc-800">
                {getCategoryIcon(manual.category)}
                {manual.category}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Mod: <strong className="text-white">{manual.model}</strong>
              </span>
            </div>
            <h3 className="text-sm font-bold text-white hover:text-red-400 transition-colors line-clamp-1">
              {manual.title}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-sans">
              {manual.description}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0 shrink-0">
          {manual.wiringDiagramNotes && (
            <button
              onClick={() => onViewSchematic(manual)}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-red-400 hover:text-red-300 border border-zinc-800 transition-all"
              title="Ver Esquema de Ligação & Jumpers"
            >
              <Wrench className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onViewPdf(manual)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/40 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Visualizar
          </button>

          <button
            onClick={() => onDownload(manual)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar ({manual.fileSize})
          </button>

          <div className="flex items-center gap-1 pl-2 border-l border-zinc-800">
            <button
              onClick={() => onEdit(manual)}
              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors"
              title="Editar Manual"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(manual.id)}
              className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-900 rounded-lg transition-colors"
              title="Excluir Manual"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid View
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-zinc-800/90 group">
      <div>
        {/* Thumbnail & Header Banner */}
        <div className="relative h-44 bg-zinc-950 overflow-hidden border-b border-zinc-800">
          <img
            src={manual.thumbnailUrl || '/images/motor_ppa_dzrio.jpg'}
            alt={manual.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md uppercase tracking-wider shadow-lg ${brandTheme.badgeBg}`}>
              {manual.brand}
            </span>

            <span className="bg-zinc-950/90 text-red-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-zinc-800 flex items-center gap-1 backdrop-blur-md">
              <FileText className="w-3 h-3 text-red-500" />
              {manual.fileType}
            </span>
          </div>

          {/* Category Badge Bottom Left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-zinc-950/95 text-zinc-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-zinc-800 shadow-md">
            {getCategoryIcon(manual.category)}
            <span>{manual.category}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono text-red-400 font-bold text-[11px] truncate max-w-[180px]">
              Mod: {manual.model}
            </span>
            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {manual.updatedAt}
            </span>
          </div>

          <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            {manual.title}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {manual.description}
          </p>

          {/* Tags */}
          {manual.tags && manual.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {manual.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-zinc-950 text-zinc-400 text-[10px] px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5 text-zinc-500" />
                  {tag}
                </span>
              ))}
              {manual.tags.length > 3 && (
                <span className="text-[10px] text-zinc-500 font-mono py-0.5">
                  +{manual.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 border-t border-zinc-800/80 mt-3">
        <div className="grid grid-cols-2 gap-2 mb-2 pt-3">
          <button
            onClick={() => onViewPdf(manual)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600/30 to-red-700/30 hover:from-red-600/40 hover:to-red-700/40 text-red-300 font-bold text-xs border border-red-500/40 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Visualizar PDF
          </button>

          <button
            onClick={() => onDownload(manual)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs border border-zinc-800 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            Baixar ({manual.fileSize})
          </button>
        </div>

        {/* Technical Schematics & Management Options */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
          {manual.wiringDiagramNotes ? (
            <button
              onClick={() => onViewSchematic(manual)}
              className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              <Wrench className="w-3 h-3" />
              Ver Esquema / Jumpers
            </button>
          ) : (
            <span className="text-[11px] text-zinc-600">Sem esquema extra</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(manual)}
              className="text-zinc-400 hover:text-red-400 transition-colors p-1"
              title="Editar Manual"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(manual.id)}
              className="text-zinc-400 hover:text-red-500 transition-colors p-1"
              title="Excluir Manual"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
