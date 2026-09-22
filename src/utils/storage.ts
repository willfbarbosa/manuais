import { Manual, BrandItem, CategoryItem } from '../types/manual';
import { INITIAL_MANUALS } from '../data/initialManuals';

const STORAGE_MANUALS_KEY = 'eletrozone_manuais_v1';
const STORAGE_BRANDS_KEY = 'eletrozone_brands_v1';
const STORAGE_CATEGORIES_KEY = 'eletrozone_categories_v1';

export const INITIAL_BRANDS: BrandItem[] = [
  { id: 'ppa', name: 'PPA', description: 'Automatizadores de Portão, Centrais JetFlex & Barreiras', color: '#f59e0b' },
  { id: 'peccinin', name: 'Peccinin', description: 'Motores Deslizantes, Basculantes & Centrais CP', color: '#3b82f6' },
  { id: 'jfl', name: 'JFL', description: 'Centrais de Alarme, Automação Smart & Receptores', color: '#ef4444' },
  { id: 'intelbras', name: 'Intelbras', description: 'Controle de Acesso Biométrico, Câmeras & Interfonia', color: '#10b981' },
  { id: 'asus', name: 'Asus', description: 'Placas Mãe Hardware, Servidores & Bios Cheatsheet', color: '#00e5ff' },
  { id: 'ipec', name: 'IPEC', description: 'Módulos Relé de Automação, Receptores & Fechaduras', color: '#f97316' },
  { id: 'garen', name: 'Garen', description: 'Automatizadores de Portão & Centrais Wave', color: '#a855f7' },
  { id: 'rossi', name: 'Rossi', description: 'Motores Rossi Nitro, Centrais de Comando VK', color: '#14b8a6' },
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-motor', name: 'Motor de Portão', description: 'Automatizadores para portão deslizante, basculante e pivô', iconName: 'Zap' },
  { id: 'cat-placa', name: 'Placa Mãe', description: 'Placas de computador, circuitos mãe e módulos principais', iconName: 'Cpu' },
  { id: 'cat-acesso', name: 'Controle de Acesso', description: 'Leitores biométricos, faciais, fechaduras e botoeiras', iconName: 'Key' },
  { id: 'cat-automacao', name: 'Automação', description: 'Módulos relé, receptores, automação residencial e predial', iconName: 'HardDrive' },
  { id: 'cat-seguranca', name: 'Segurança & Alarmes', description: 'Centrais de alarme, cercas elétricas e sensores', iconName: 'Shield' },
];

// MANUALS STORAGE
export const getStoredManuals = (): Manual[] => {
  try {
    const data = localStorage.getItem(STORAGE_MANUALS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_MANUALS_KEY, JSON.stringify(INITIAL_MANUALS));
      return INITIAL_MANUALS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler manuais do localStorage:', error);
    return INITIAL_MANUALS;
  }
};

export const saveManual = (manual: Manual): Manual[] => {
  const manuals = getStoredManuals();
  const existingIndex = manuals.findIndex(m => m.id === manual.id);

  let updated: Manual[];
  if (existingIndex >= 0) {
    updated = [...manuals];
    updated[existingIndex] = { ...manual, updatedAt: new Date().toISOString().split('T')[0] };
  } else {
    updated = [{ ...manual, updatedAt: new Date().toISOString().split('T')[0] }, ...manuals];
  }

  localStorage.setItem(STORAGE_MANUALS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteManual = (id: string): Manual[] => {
  const manuals = getStoredManuals();
  const updated = manuals.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_MANUALS_KEY, JSON.stringify(updated));
  return updated;
};

export const incrementDownloadCount = (id: string): Manual[] => {
  const manuals = getStoredManuals();
  const updated = manuals.map(m => {
    if (m.id === id) {
      return { ...m, downloadCount: (m.downloadCount || 0) + 1 };
    }
    return m;
  });
  localStorage.setItem(STORAGE_MANUALS_KEY, JSON.stringify(updated));
  return updated;
};

// BRANDS STORAGE
export const getStoredBrands = (): BrandItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_BRANDS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_BRANDS_KEY, JSON.stringify(INITIAL_BRANDS));
      return INITIAL_BRANDS;
    }
    return JSON.parse(data);
  } catch (error) {
    return INITIAL_BRANDS;
  }
};

export const saveBrand = (brand: BrandItem): BrandItem[] => {
  const brands = getStoredBrands();
  const index = brands.findIndex(b => b.id === brand.id || b.name.toLowerCase() === brand.name.toLowerCase());
  
  let updated: BrandItem[];
  if (index >= 0) {
    updated = [...brands];
    updated[index] = brand;
  } else {
    updated = [...brands, brand];
  }
  
  localStorage.setItem(STORAGE_BRANDS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteBrand = (id: string): BrandItem[] => {
  const brands = getStoredBrands();
  const updated = brands.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_BRANDS_KEY, JSON.stringify(updated));
  return updated;
};

// CATEGORIES STORAGE
export const getStoredCategories = (): CategoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(data);
  } catch (error) {
    return INITIAL_CATEGORIES;
  }
};

export const saveCategory = (category: CategoryItem): CategoryItem[] => {
  const categories = getStoredCategories();
  const index = categories.findIndex(c => c.id === category.id || c.name.toLowerCase() === category.name.toLowerCase());
  
  let updated: CategoryItem[];
  if (index >= 0) {
    updated = [...categories];
    updated[index] = category;
  } else {
    updated = [...categories, category];
  }
  
  localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteCategory = (id: string): CategoryItem[] => {
  const categories = getStoredCategories();
  const updated = categories.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
};

// RESET ALL
export const resetToInitialManuals = (): { manuals: Manual[]; brands: BrandItem[]; categories: CategoryItem[] } => {
  localStorage.setItem(STORAGE_MANUALS_KEY, JSON.stringify(INITIAL_MANUALS));
  localStorage.setItem(STORAGE_BRANDS_KEY, JSON.stringify(INITIAL_BRANDS));
  localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
  return { manuals: INITIAL_MANUALS, brands: INITIAL_BRANDS, categories: INITIAL_CATEGORIES };
};

// BACKUP EXPORT & IMPORT
export const exportManualsJSON = (): void => {
  const manuals = getStoredManuals();
  const brands = getStoredBrands();
  const categories = getStoredCategories();

  const backupObj = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    manuals,
    brands,
    categories
  };

  const jsonStr = JSON.stringify(backupObj, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eletrozone_manuais_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importManualsJSON = (fileContent: string): { manuals: Manual[]; brands: BrandItem[]; categories: CategoryItem[] } => {
  try {
    const parsed = JSON.parse(fileContent);
    let manuals: Manual[] = [];
    let brands: BrandItem[] = getStoredBrands();
    let categories: CategoryItem[] = getStoredCategories();

    if (Array.isArray(parsed)) {
      manuals = parsed;
    } else if (parsed.manuals && Array.isArray(parsed.manuals)) {
      manuals = parsed.manuals;
      if (Array.isArray(parsed.brands)) brands = parsed.brands;
      if (Array.isArray(parsed.categories)) categories = parsed.categories;
    } else {
      throw new Error('Estrutura do arquivo de backup inválida.');
    }

    localStorage.setItem(STORAGE_MANUALS_KEY, JSON.stringify(manuals));
    localStorage.setItem(STORAGE_BRANDS_KEY, JSON.stringify(brands));
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));

    return { manuals, brands, categories };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
