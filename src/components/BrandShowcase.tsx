import React from 'react';
import { Manual, BrandItem } from '../types/manual';
import { getBrandTheme } from '../utils/brandStyles';
import { ChevronRight, FileText, Layers, Plus } from 'lucide-react';

interface BrandShowcaseProps {
  manuals: Manual[];
  brands: BrandItem[];
  onSelectBrand: (brand: string) => void;
  onOpenBrandModal: () => void;
}

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({
  manuals,
  brands,
  onSelectBrand,
  onOpenBrandModal
}) => {
  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" />
            Navegue por Marcas Cadastradas
          </h2>
          <p className="text-xs text-zinc-400">
            Selecione uma marca para filtrar os manuais técnicos ou adicione novas marcas
          </p>
        </div>
        <button
          onClick={onOpenBrandModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Marca
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {brands.map((b) => {
          const brandManuals = manuals.filter(m => m.brand.toLowerCase() === b.name.toLowerCase());
          const theme = getBrandTheme(b.name);

          return (
            <div
              key={b.id}
              onClick={() => onSelectBrand(b.name)}
              className="glass-panel glass-panel-hover rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl border uppercase tracking-wider ${theme.badgeBg}`}>
                    {b.name}
                  </span>
                  <span className="text-[11px] font-mono text-red-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-red-500" />
                    {brandManuals.length} {brandManuals.length === 1 ? 'manual' : 'manuais'}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {b.description || 'Equipamentos e manuais homologados.'}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-red-400 font-bold group-hover:text-red-300 transition-colors">
                <span>Ver Manuais {b.name}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
