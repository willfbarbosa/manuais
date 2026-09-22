import React, { useState } from 'react';
import { CategoryItem } from '../types/manual';
import { X, Plus, FolderPlus, Trash2, Edit3, CheckCircle2, Zap, Cpu, Key, HardDrive, Shield } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onSaveCategory: (category: CategoryItem) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategory,
  onDeleteCategory
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCategory: CategoryItem = {
      id: editingId || `cat-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Categoria de manuais e equipamentos',
      iconName: 'Zap'
    };

    onSaveCategory(newCategory);
    setName('');
    setDescription('');
    setEditingId(null);
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-modal my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Gerenciar & Cadastrar Categorias
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Adicione categorias (Motor de Portão, Placa Mãe, Controle de Acesso, etc.)
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

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Add / Edit Form */}
          <form onSubmit={handleSubmit} className="bg-zinc-950 p-4 rounded-2xl border border-red-500/20 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              {editingId ? 'Editar Categoria Existente' : 'Cadastrar Nova Categoria'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Interfonia, Câmeras IP, No-breaks"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Descrição Resumida
                </label>
                <input
                  type="text"
                  placeholder="Ex: Manuais para interfones e vídeo porteiros..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setDescription('');
                  }}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancelar Edição
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {editingId ? 'Salvar Categoria' : 'Cadastrar Categoria'}
              </button>
            </div>
          </form>

          {/* List of Registered Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wider">
              Categorias Cadastradas ({categories.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800/80 flex items-center justify-between gap-3 group hover:border-red-500/40 transition-all"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-red-400" />
                        {c.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-1">
                      {c.description || 'Sem descrição'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors"
                      title="Editar Categoria"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCategory(c.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-900 rounded-lg transition-colors"
                      title="Excluir Categoria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
