import React, { useState, useEffect, useMemo } from 'react';
import { Manual, ViewMode, BrandItem, CategoryItem } from './types/manual';
import {
  getStoredManuals,
  saveManual,
  deleteManual,
  incrementDownloadCount,
  getStoredBrands,
  saveBrand,
  deleteBrand,
  getStoredCategories,
  saveCategory,
  deleteCategory
} from './utils/storage';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ManualCard } from './components/ManualCard';
import { BrandShowcase } from './components/BrandShowcase';
import { ManualFormModal } from './components/ManualFormModal';
import { BrandModal } from './components/BrandModal';
import { CategoryModal } from './components/CategoryModal';
import { PDFViewerModal } from './components/PDFViewerModal';
import { TechnicalCheatsheetModal } from './components/TechnicalCheatsheetModal';
import { BackupModal } from './components/BackupModal';
import { FileText, PlusCircle, Shield } from 'lucide-react';

export function App() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [activeTab, setActiveTab] = useState<'catalog' | 'brands' | 'categories'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingManual, setEditingManual] = useState<Manual | null>(null);
  const [viewingPdfManual, setViewingPdfManual] = useState<Manual | null>(null);
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Load state on mount
  useEffect(() => {
    setManuals(getStoredManuals());
    setBrands(getStoredBrands());
    setCategories(getStoredCategories());
  }, []);

  // Filtered manuals memo
  const filteredManuals = useMemo(() => {
    return manuals.filter((m) => {
      // Brand filter
      if (selectedBrand !== 'All' && m.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && m.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesBrand = m.brand.toLowerCase().includes(q);
        const matchesModel = m.model.toLowerCase().includes(q);
        const matchesCategory = m.category.toLowerCase().includes(q);
        const matchesDescription = m.description.toLowerCase().includes(q);
        const matchesTags = m.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSchematics = m.wiringDiagramNotes?.toLowerCase().includes(q);

        return (
          matchesTitle ||
          matchesBrand ||
          matchesModel ||
          matchesCategory ||
          matchesDescription ||
          matchesTags ||
          matchesSchematics
        );
      }
      return true;
    });
  }, [manuals, selectedBrand, selectedCategory, searchQuery]);

  // Handlers for Manuals
  const handleSaveManual = (manual: Manual) => {
    const updated = saveManual(manual);
    setManuals(updated);
  };

  const handleDeleteManual = (id: string) => {
    if (confirm('Tem certeza que deseja remover este manual do catálogo?')) {
      const updated = deleteManual(id);
      setManuals(updated);
    }
  };

  // Handlers for Brands
  const handleSaveBrand = (brand: BrandItem) => {
    const updated = saveBrand(brand);
    setBrands(updated);
  };

  const handleDeleteBrand = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta marca?')) {
      const updated = deleteBrand(id);
      setBrands(updated);
    }
  };

  // Handlers for Categories
  const handleSaveCategory = (category: CategoryItem) => {
    const updated = saveCategory(category);
    setCategories(updated);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta categoria?')) {
      const updated = deleteCategory(id);
      setCategories(updated);
    }
  };

  const handleDownload = (manual: Manual) => {
    const updated = incrementDownloadCount(manual.id);
    setManuals(updated);

    const a = document.createElement('a');
    a.href = manual.fileUrl;
    a.download = `${manual.brand}_${manual.model}_manual.pdf`;
    a.target = '_blank';
    a.click();
  };

  const handleEditClick = (manual: Manual) => {
    setEditingManual(manual);
    setIsFormModalOpen(true);
  };

  const handleOpenNewModal = () => {
    setEditingManual(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-zinc-100 selection:bg-red-600 selection:text-white">
      
      {/* Header */}
      <Header
        onOpenNewManualModal={handleOpenNewModal}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenCheatsheetModal={() => setIsCheatsheetOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalManuals={manuals.length}
        totalBrands={brands.length}
        totalCategories={categories.length}
        selectedBrandFilter={selectedBrand}
        onSelectBrand={(b) => setSelectedBrand(b)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Brand Showcase Block (when 'brands' tab is active) */}
        {activeTab === 'brands' ? (
          <div>
            <BrandShowcase
              manuals={manuals}
              brands={brands}
              onSelectBrand={(b) => {
                setSelectedBrand(b);
                setActiveTab('catalog');
              }}
              onOpenBrandModal={() => setIsBrandModalOpen(true)}
            />
          </div>
        ) : (
          <>
            {/* Search & Category Filter Bar */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalResults={filteredManuals.length}
              brands={brands}
              categories={categories}
              onOpenBrandModal={() => setIsBrandModalOpen(true)}
              onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
            />

            {/* Quick Filter Info Tag if filtered */}
            {(selectedBrand !== 'All' || selectedCategory !== 'All' || searchQuery) && (
              <div className="flex items-center justify-between mb-4 bg-zinc-900/80 px-4 py-2 rounded-xl border border-zinc-800 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="text-zinc-400 font-mono">Filtros ativos:</span>
                  {selectedBrand !== 'All' && (
                    <span className="bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded border border-red-500/30">
                      Marca: {selectedBrand}
                    </span>
                  )}
                  {selectedCategory !== 'All' && (
                    <span className="bg-red-600/20 text-red-300 font-bold px-2 py-0.5 rounded border border-red-600/30">
                      Categoria: {selectedCategory}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                      Busca: "{searchQuery}"
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedBrand('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-red-400 hover:underline font-bold text-xs"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Manuals Grid / List */}
            {filteredManuals.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredManuals.map((manual) => (
                  <ManualCard
                    key={manual.id}
                    manual={manual}
                    viewMode={viewMode}
                    onViewPdf={(m) => setViewingPdfManual(m)}
                    onViewSchematic={(m) => setViewingPdfManual(m)}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteManual}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search Results State */
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-12">
                <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Nenhum manual encontrado</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Não encontramos manuais para os filtros ou busca informada.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedBrand('All');
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all"
                  >
                    Resetar Filtros
                  </button>
                  <button
                    onClick={handleOpenNewModal}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Cadastrar Manual
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800/80 py-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">
                ELETROZONE &bull; Central de Manuais (Preto & Vermelho)
              </p>
              <p className="text-[11px] text-zinc-500 font-mono">
                Hospedado em: <span className="text-red-400">manuais.eletrozone.net.br</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>{brands.length} Marcas Homologadas</span>
            <span>&bull;</span>
            <span>{categories.length} Categorias</span>
            <span>&bull;</span>
            <span>Eletrozone &copy; 2026</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ManualFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveManual}
        editingManual={editingManual}
        brands={brands}
        categories={categories}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />

      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        brands={brands}
        onSaveBrand={handleSaveBrand}
        onDeleteBrand={handleDeleteBrand}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <PDFViewerModal
        manual={viewingPdfManual}
        onClose={() => setViewingPdfManual(null)}
        onDownload={handleDownload}
      />

      <TechnicalCheatsheetModal
        isOpen={isCheatsheetOpen}
        onClose={() => setIsCheatsheetOpen(false)}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onDataUpdated={(updated) => {
          setManuals(updated.manuals);
          setBrands(updated.brands);
          setCategories(updated.categories);
        }}
      />
    </div>
  );
}
