import React, { useState, useEffect, useRef } from 'react';
import { Manual, BrandItem, CategoryItem } from '../types/manual';
import { X, Upload, FileText, Image as ImageIcon, Wrench, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ManualFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (manual: Manual) => void;
  editingManual?: Manual | null;
  brands: BrandItem[];
  categories: CategoryItem[];
  onOpenBrandModal: () => void;
  onOpenCategoryModal: () => void;
}

export const ManualFormModal: React.FC<ManualFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingManual,
  brands,
  categories,
  onOpenBrandModal,
  onOpenCategoryModal
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState<string>('PPA');
  const [customBrand, setCustomBrand] = useState('');
  const [category, setCategory] = useState<string>('Motor de Portão');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [wiringDiagramNotes, setWiringDiagramNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [jumpers, setJumpers] = useState<Array<{ dip: string; function: string; defaultVal: string }>>([
    { dip: 'PROG', function: 'Gravação de Controles / Percurso', defaultVal: 'OFF' }
  ]);

  useEffect(() => {
    if (editingManual) {
      setTitle(editingManual.title);
      setBrand(editingManual.brand);
      setCategory(editingManual.category);
      setModel(editingManual.model);
      setVersion(editingManual.version);
      setDescription(editingManual.description);
      setFileUrl(editingManual.fileUrl);
      setFileSize(editingManual.fileSize);
      setThumbnailUrl(editingManual.thumbnailUrl);
      setWiringDiagramNotes(editingManual.wiringDiagramNotes || '');
      setTagsInput(editingManual.tags.join(', '));
      setJumpers(editingManual.jumperSettings || []);
      setValidationError(null);
    } else {
      // Reset form
      setTitle('');
      if (brands.length > 0) setBrand(brands[0].name);
      if (categories.length > 0) setCategory(categories[0].name);
      setCustomBrand('');
      setModel('');
      setVersion('v1.0');
      setDescription('');
      setFileUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
      setFileName('');
      setFileSize('3.5 MB');
      setThumbnailUrl('/images/motor_ppa_dzrio.jpg');
      setWiringDiagramNotes('');
      setTagsInput('');
      setJumpers([{ dip: 'PROG', function: 'Gravação de Controles', defaultVal: 'OFF' }]);
      setValidationError(null);
    }
  }, [editingManual, isOpen]);

  // Keep brand and category in sync if new items added
  useEffect(() => {
    if (!brand && brands.length > 0) setBrand(brands[0].name);
    if (!category && categories.length > 0) setCategory(categories[0].name);
  }, [brands, categories]);

  if (!isOpen) return null;

  // Handle PDF file upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      
      // Fast Blob URL for instant viewing
      const blobUrl = URL.createObjectURL(file);
      setFileUrl(blobUrl);

      // FileReader fallback for Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image thumbnail upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setThumbnailUrl(blobUrl);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbnailUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddJumper = () => {
    setJumpers([...jumpers, { dip: 'DIP 1', function: 'Descrição da Chave', defaultVal: 'OFF' }]);
  };

  const handleRemoveJumper = (index: number) => {
    setJumpers(jumpers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Por favor, preencha o Título do Manual na Seção 1.');
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!model.trim()) {
      setValidationError('Por favor, preencha o Modelo / Código Comercial na Seção 1.');
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const finalBrand = brand === 'Outra' && customBrand ? customBrand : brand;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newManual: Manual = {
      id: editingManual ? editingManual.id : `manual-${Date.now()}`,
      title: title.trim(),
      brand: finalBrand,
      category: category || (categories.length > 0 ? categories[0].name : 'Geral'),
      model: model.trim(),
      version: version || 'v1.0',
      description: description.trim(),
      fileSize: fileSize || '2.5 MB',
      fileType: 'PDF',
      fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      thumbnailUrl: thumbnailUrl || '/images/motor_ppa_dzrio.jpg',
      updatedAt: new Date().toISOString().split('T')[0],
      wiringDiagramNotes,
      jumperSettings: jumpers,
      tags: tags.length > 0 ? tags : [finalBrand, category, model],
      downloadCount: editingManual ? editingManual.downloadCount : 0
    };

    try {
      onSave(newManual);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar manual. Verifique se os dados estão corretos.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-modal my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingManual ? 'Editar Manual de Equipamento' : 'Cadastrar Novo Manual de Equipamento'}
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Central Eletrozone &bull; manuais.eletrozone.net.br
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

        {/* Validation Warning Alert if needed */}
        {validationError && (
          <div className="mx-6 mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Modal Form Body */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Basic Equipment Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono border-b border-zinc-800 pb-2">
              1. Identificação do Equipamento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Marca do Equipamento *
                  </label>
                  <button
                    type="button"
                    onClick={onOpenBrandModal}
                    className="text-[11px] text-red-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" /> Nova Marca
                  </button>
                </div>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 font-medium"
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                  <option value="Outra">Outra Marca...</option>
                </select>

                {brand === 'Outra' && (
                  <input
                    type="text"
                    placeholder="Digite o nome da marca..."
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="w-full mt-2 px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Categoria *
                  </label>
                  <button
                    type="button"
                    onClick={onOpenCategoryModal}
                    className="text-[11px] text-red-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" /> Nova Categoria
                  </button>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 font-medium"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Modelo / Código Comercial *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dz Rio 500 / SS 3530 / Prime B450M"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Versão / Placa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Rev 3.4 / FW v2.1"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Título do Manual *
              </label>
              <input
                type="text"
                placeholder="Ex: Manual Técnico de Instalação e Ligação Elétrica Motor PPA Dz Rio"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Descrição Resumida
              </label>
              <textarea
                rows={2}
                placeholder="Resumo técnico do manual, aplicação e observações de campo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 font-medium"
              />
            </div>
          </div>

          {/* Section 2: Upload Files & Presets */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono border-b border-zinc-800 pb-2">
              2. Arquivo do Manual (PDF) & Foto do Produto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PDF Upload Box */}
              <div className="p-4 bg-zinc-950 border border-dashed border-zinc-700 rounded-2xl text-center">
                <Upload className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-white mb-1">
                  Upload do Arquivo PDF
                </p>
                <p className="text-[11px] text-zinc-400 mb-3 truncate px-2">
                  {fileName ? `Selecionado: ${fileName}` : 'Arraste ou selecione o arquivo PDF técnico'}
                </p>
                <label className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-xl border border-red-500/40 cursor-pointer transition-all">
                  <FileText className="w-3.5 h-3.5" />
                  Escolher PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Photo Thumbnail Selector */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-red-500" />
                    Foto do Equipamento
                  </span>
                  <label className="text-[11px] text-red-400 hover:underline cursor-pointer font-medium">
                    Upload Foto...
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Motor PPA', url: '/images/motor_ppa_dzrio.jpg' },
                    { label: 'Intelbras', url: '/images/intelbras_controle_acesso.jpg' },
                    { label: 'Asus Board', url: '/images/asus_placa_mae.jpg' },
                    { label: 'Central JFL', url: '/images/jfl_automacao_central.jpg' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setThumbnailUrl(preset.url)}
                      className={`relative rounded-lg overflow-hidden border h-14 transition-all ${
                        thumbnailUrl === preset.url
                          ? 'border-red-500 ring-2 ring-red-500/40'
                          : 'border-zinc-800 hover:border-zinc-600 opacity-60'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      {thumbnailUrl === preset.url && (
                        <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-red-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Schematics & Jumpers Cheatsheet */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5" />
              3. Esquema Elétrico & Tabela de Jumpers (Instrução Técnica)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Esquema de Ligação dos Bornes (Texto / Markdown)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Bornes U/V/W -> Motor | 12V/GND -> Alimentação | BOT -> Botoeira GND..."
                value={wiringDiagramNotes}
                onChange={(e) => setWiringDiagramNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white code-font focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Jumpers Table Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                  Configuração de Jumpers & Chaves DIP
                </span>
                <button
                  type="button"
                  onClick={handleAddJumper}
                  className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Jumper
                </button>
              </div>

              {jumpers.map((j, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Pino/Jumper"
                    value={j.dip}
                    onChange={(e) => {
                      const updated = [...jumpers];
                      updated[idx].dip = e.target.value;
                      setJumpers(updated);
                    }}
                    className="w-1/4 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white code-font"
                  />
                  <input
                    type="text"
                    placeholder="Função da Chave"
                    value={j.function}
                    onChange={(e) => {
                      const updated = [...jumpers];
                      updated[idx].function = e.target.value;
                      setJumpers(updated);
                    }}
                    className="w-2/4 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Valor Padrão"
                    value={j.defaultVal}
                    onChange={(e) => {
                      const updated = [...jumpers];
                      updated[idx].defaultVal = e.target.value;
                      setJumpers(updated);
                    }}
                    className="w-1/4 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white code-font"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveJumper(idx)}
                    className="p-1.5 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Palavras-chave / Tags (Separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="Ex: PPA, Motor Deslizante, JetFlex, Placa Agility"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 font-medium"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              {editingManual ? 'Salvar Alterações' : 'Cadastrar Manual'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
