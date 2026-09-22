import { createClient } from '@libsql/client/web';
import { Manual, BrandItem, CategoryItem } from '../types/manual';

// Env variables for Vercel / Vite
const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL || '';
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN || '';

export const isTursoConfigured = () => {
  return Boolean(TURSO_URL && TURSO_TOKEN);
};

export const getTursoClient = () => {
  if (!isTursoConfigured()) return null;
  return createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN,
  });
};

// MANUALS DB SYNC
export const fetchManualsFromTurso = async (): Promise<Manual[] | null> => {
  const client = getTursoClient();
  if (!client) return null;

  try {
    const res = await client.execute('SELECT * FROM manuals ORDER BY updated_at DESC');
    return res.rows.map((row: any) => ({
      id: String(row.id),
      title: String(row.title),
      brand: String(row.brand),
      category: String(row.category),
      model: String(row.model),
      version: String(row.version || 'v1.0'),
      description: String(row.description || ''),
      fileSize: String(row.file_size || '2.5 MB'),
      fileType: (row.file_type || 'PDF') as any,
      fileUrl: String(row.file_url),
      thumbnailUrl: String(row.thumbnail_url || '/images/motor_ppa_dzrio.jpg'),
      updatedAt: String(row.updated_at || new Date().toISOString().split('T')[0]),
      wiringDiagramNotes: row.wiring_diagram_notes ? String(row.wiring_diagram_notes) : undefined,
      jumperSettings: row.jumper_settings ? JSON.parse(String(row.jumper_settings)) : [],
      tags: row.tags ? JSON.parse(String(row.tags)) : [],
      downloadCount: Number(row.download_count || 0)
    }));
  } catch (err) {
    console.warn('Erro ao carregar do Turso DB:', err);
    return null;
  }
};

export const saveManualToTurso = async (manual: Manual): Promise<boolean> => {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await client.execute({
      sql: `INSERT INTO manuals (id, title, brand, category, model, version, description, file_size, file_type, file_url, thumbnail_url, updated_at, wiring_diagram_notes, jumper_settings, tags, download_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
            title=excluded.title, brand=excluded.brand, category=excluded.category, model=excluded.model,
            version=excluded.version, description=excluded.description, file_size=excluded.file_size,
            file_url=excluded.file_url, thumbnail_url=excluded.thumbnail_url, updated_at=excluded.updated_at,
            wiring_diagram_notes=excluded.wiring_diagram_notes, jumper_settings=excluded.jumper_settings,
            tags=excluded.tags, download_count=excluded.download_count`,
      args: [
        manual.id,
        manual.title,
        manual.brand,
        manual.category,
        manual.model,
        manual.version,
        manual.description,
        manual.fileSize,
        manual.fileType,
        manual.fileUrl,
        manual.thumbnailUrl,
        manual.updatedAt,
        manual.wiringDiagramNotes || '',
        JSON.stringify(manual.jumperSettings || []),
        JSON.stringify(manual.tags || []),
        manual.downloadCount || 0
      ]
    });
    return true;
  } catch (err) {
    console.error('Erro ao salvar no Turso DB:', err);
    return false;
  }
};

export const deleteManualFromTurso = async (id: string): Promise<boolean> => {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await client.execute({
      sql: 'DELETE FROM manuals WHERE id = ?',
      args: [id]
    });
    return true;
  } catch (err) {
    console.error('Erro ao excluir no Turso DB:', err);
    return false;
  }
};

// BRANDS DB SYNC
export const fetchBrandsFromTurso = async (): Promise<BrandItem[] | null> => {
  const client = getTursoClient();
  if (!client) return null;

  try {
    const res = await client.execute('SELECT * FROM brands ORDER BY name ASC');
    return res.rows.map((row: any) => ({
      id: String(row.id),
      name: String(row.name),
      description: String(row.description || ''),
      color: String(row.color || '#ef4444')
    }));
  } catch (err) {
    console.warn('Erro ao buscar marcas do Turso DB:', err);
    return null;
  }
};

export const saveBrandToTurso = async (brand: BrandItem): Promise<boolean> => {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await client.execute({
      sql: `INSERT INTO brands (id, name, description, color) VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name=excluded.name, description=excluded.description, color=excluded.color`,
      args: [brand.id, brand.name, brand.description || '', brand.color || '#ef4444']
    });
    return true;
  } catch (err) {
    console.error('Erro ao salvar marca no Turso:', err);
    return false;
  }
};

// CATEGORIES DB SYNC
export const fetchCategoriesFromTurso = async (): Promise<CategoryItem[] | null> => {
  const client = getTursoClient();
  if (!client) return null;

  try {
    const res = await client.execute('SELECT * FROM categories ORDER BY name ASC');
    return res.rows.map((row: any) => ({
      id: String(row.id),
      name: String(row.name),
      description: String(row.description || ''),
      iconName: String(row.icon_name || 'Zap')
    }));
  } catch (err) {
    console.warn('Erro ao buscar categorias do Turso DB:', err);
    return null;
  }
};

export const saveCategoryToTurso = async (category: CategoryItem): Promise<boolean> => {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await client.execute({
      sql: `INSERT INTO categories (id, name, description, icon_name) VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name=excluded.name, description=excluded.description, icon_name=excluded.icon_name`,
      args: [category.id, category.name, category.description || '', category.iconName || 'Zap']
    });
    return true;
  } catch (err) {
    console.error('Erro ao salvar categoria no Turso:', err);
    return false;
  }
};
