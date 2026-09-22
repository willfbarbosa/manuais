import React from 'react';
import { BookOpen, PlusCircle, Wrench, Globe, HardDriveDownload, Layers, FolderPlus, ShieldCheck, Cpu, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenNewManualModal: () => void;
  onOpenBrandModal: () => void;
  onOpenCategoryModal: () => void;
  onOpenCheatsheetModal: () => void;
  onOpenBackupModal: () => void;
  activeTab: 'catalog' | 'brands' | 'categories';
  setActiveTab: (tab: 'catalog' | 'brands' | 'categories') => void;
  totalManuals: number;
  totalBrands: number;
  totalCategories: number;
  selectedBrandFilter: string;
  onSelectBrand: (brand: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewManualModal,
  onOpenBrandModal,
  onOpenCategoryModal,
  onOpenCheatsheetModal,
  onOpenBackupModal,
  activeTab,
  setActiveTab,
  totalManuals,
  totalBrands,
  totalCategories,
  selectedBrandFilter,
  onSelectBrand
}) => {
  // Mobile dropdown selector handler
  const handleMobileMenuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    switch (value) {
      case 'catalog':
        setActiveTab('catalog');
        onSelectBrand('All');
        break;
      case 'brands_tab':
        setActiveTab('brands');
        break;
      case 'add_brand':
        onOpenBrandModal();
        break;
      case 'add_category':
        onOpenCategoryModal();
        break;
      case 'cheatsheet':
        onOpenCheatsheetModal();
        break;
      case 'backup':
        onOpenBackupModal();
        break;
      case 'new_manual':
        onOpenNewManualModal();
        break;
      default:
        break;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl">
      {/* Top Banner / Domain Indicator - Black & Red */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-950 to-zinc-900 px-3 sm:px-4 py-1.5 border-b border-red-600/30 text-xs flex items-center justify-between text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-semibold text-red-400 tracking-wide text-[11px] sm:text-xs">ELETROZONE HUB</span>
          <span className="text-zinc-600 hidden xs:inline">|</span>
          <div className="flex items-center gap-1 text-zinc-300 bg-zinc-900/90 px-2 py-0.5 rounded border border-red-500/30 font-mono text-[10px] sm:text-[11px]">
            <Globe className="w-3 h-3 text-red-400 shrink-0" />
            <span className="text-red-200">manuais.eletrozone.net.br</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] text-zinc-400 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> Base 2026
          </span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-red-400" /> {totalManuals} Manuais &bull; {totalBrands} Marcas &bull; {totalCategories} Categorias
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => { setActiveTab('catalog'); onSelectBrand('All'); }}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 p-0.5 shadow-lg shadow-red-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-red-500">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  ELETROZONE <span className="text-red-500 font-light">MANUAIS</span>
                </h1>
                <span className="bg-red-500/10 text-red-400 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded border border-red-500/30 font-mono hidden sm:inline">
                  v3.0 RED
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium">
                Central de Cadastro & Manuais
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => { setActiveTab('catalog'); onSelectBrand('All'); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'catalog' && selectedBrandFilter === 'All'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-md shadow-red-600/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Catálogo Geral
            </button>

            <button
              onClick={onOpenBrandModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-red-300 hover:bg-red-950/40 transition-all border border-transparent hover:border-red-800/50"
            >
              <Layers className="w-3.5 h-3.5 text-red-400" />
              + Cadastrar Marcas
            </button>

            <button
              onClick={onOpenCategoryModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-red-300 hover:bg-red-950/40 transition-all border border-transparent hover:border-red-800/50"
            >
              <FolderPlus className="w-3.5 h-3.5 text-red-400" />
              + Cadastrar Categorias
            </button>

            <button
              onClick={onOpenCheatsheetModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-red-300 hover:bg-red-950/40 transition-all border border-transparent hover:border-red-800/50"
            >
              <Wrench className="w-3.5 h-3.5 text-red-400" />
              Guia Técnico
            </button>

            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              title="Backup e Exportação em JSON"
            >
              <HardDriveDownload className="w-3.5 h-3.5" />
              Backup
            </button>
          </nav>

          {/* Desktop Cadastrar Button */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onOpenNewManualModal}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-red-600/30 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Cadastrar Manual</span>
            </button>
          </div>

          {/* Mobile Menu Dropdown Selector (Otimizador de Espaço para Celular) */}
          <div className="flex lg:hidden items-center gap-2 w-auto max-w-[200px] xs:max-w-[240px]">
            <div className="relative w-full">
              <select
                onChange={handleMobileMenuChange}
                value={activeTab === 'brands' ? 'brands_tab' : 'catalog'}
                className="w-full pl-8 pr-7 py-2 bg-zinc-950 border border-red-500/40 rounded-xl text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none shadow-md shadow-red-950/50 cursor-pointer truncate"
              >
                <option value="catalog">📖 Catálogo Geral ({totalManuals})</option>
                <option value="new_manual">➕ Cadastrar Novo Manual</option>
                <option value="add_brand">🏷️ + Cadastrar Marcas ({totalBrands})</option>
                <option value="add_category">📂 + Cadastrar Categorias ({totalCategories})</option>
                <option value="brands_tab">🔍 Ver Lista por Marcas</option>
                <option value="cheatsheet">🔧 Guia Técnico & Pinouts</option>
                <option value="backup">💾 Backup & Exportação JSON</option>
              </select>
              {/* Left Menu Icon */}
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-red-500">
                <Menu className="w-3.5 h-3.5" />
              </div>
              {/* Right Arrow Icon */}
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-red-400 font-bold text-[10px]">
                ▼
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
