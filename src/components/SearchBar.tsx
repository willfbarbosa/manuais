import React from 'react';
import { Search, X, Filter, Grid, List, Plus, Layers, FolderPlus } from 'lucide-react';
import { ViewMode, BrandItem, CategoryItem } from '../types/manual';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  totalResults: number;
  brands: BrandItem[];
  categories: CategoryItem[];
  onOpenBrandModal: () => void;
  onOpenCategoryModal: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  totalResults,
  brands,
  categories,
  onOpenBrandModal,
  onOpenCategoryModal
}) => {
  return (
    <div className="space-y-4 mb-6">
      
      {/* Top Search Input & Controls Bar */}
      <div className="bg-zinc-900/90 p-3 sm:p-4 rounded-2xl border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4 text-red-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por modelo, marca (PPA, Intelbras...), código, palavra-chave ou esquema..."
            className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Toggle & Total Count */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-zinc-800 pt-2 md:pt-0">
          <span className="text-xs text-zinc-400 font-medium font-mono">
            {totalResults} {totalResults === 1 ? 'manual encontrado' : 'manuais encontrados'}
          </span>
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Visualização em Grade"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Visualização em Lista Detalhada"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Brand Chips Filter with + Cadastrar Marca button */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1 shrink-0 font-mono flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-red-400" /> Marcas:
        </span>
        
        <button
          onClick={() => setSelectedBrand('All')}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedBrand === 'All'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
          }`}
        >
          Todas as Marcas
        </button>

        {brands.map((b) => {
          const isSelected = selectedBrand === b.name;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.name)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50 ring-1 ring-red-500'
                  : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              {b.name}
            </button>
          );
        })}

        <button
          onClick={onOpenBrandModal}
          className="shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-900/50 text-red-400 border border-dashed border-red-500/40 hover:bg-red-950/40 transition-all flex items-center gap-1 cursor-pointer ml-1"
          title="Cadastrar Nova Marca"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nova Marca</span>
        </button>
      </div>

      {/* Category Tabs Filter with + Cadastrar Categoria button */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1 shrink-0 font-mono flex items-center gap-1">
          <FolderPlus className="w-3.5 h-3.5 text-red-400" /> Categorias:
        </span>

        <button
          onClick={() => setSelectedCategory('All')}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-zinc-800 text-red-400 border border-red-500/40 font-bold shadow-inner'
              : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border border-zinc-800/50 hover:bg-zinc-900'
          }`}
        >
          Todas Categorias
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-zinc-800 text-red-400 border border-red-500/40 font-bold shadow-inner'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border border-zinc-800/50 hover:bg-zinc-900'
              }`}
            >
              {cat.name}
            </button>
          );
        })}

        <button
          onClick={onOpenCategoryModal}
          className="shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-900/50 text-red-400 border border-dashed border-red-500/40 hover:bg-red-950/40 transition-all flex items-center gap-1 cursor-pointer ml-1"
          title="Cadastrar Nova Categoria"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nova Categoria</span>
        </button>
      </div>
    </div>
  );
};
