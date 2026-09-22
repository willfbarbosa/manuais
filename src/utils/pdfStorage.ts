// Storage de Arquivos PDF via IndexedDB (Sem limite de tamanho do LocalStorage)
const DB_NAME = 'eletrozone_pdf_db';
const STORE_NAME = 'pdf_files';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const ensureBlobUrl = (urlOrData: string): string => {
  if (!urlOrData) return '';
  if (urlOrData.startsWith('blob:')) return urlOrData;
  if (urlOrData.startsWith('data:application/pdf')) {
    try {
      const arr = urlOrData.split(',');
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (e) {
      return urlOrData;
    }
  }
  return urlOrData;
};

export const savePdfFileToIDB = async (id: string, fileOrBlob: Blob | File | string): Promise<string> => {
  try {
    const db = await openDB();
    let blobToStore: Blob;

    if (typeof fileOrBlob === 'string') {
      if (fileOrBlob.startsWith('data:')) {
        const arr = fileOrBlob.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        blobToStore = new Blob([u8arr], { type: mime });
      } else {
        return ensureBlobUrl(fileOrBlob);
      }
    } else {
      blobToStore = fileOrBlob;
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(blobToStore, id);

      req.onsuccess = () => {
        const objectUrl = URL.createObjectURL(blobToStore);
        resolve(objectUrl);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Erro ao salvar PDF no IndexedDB:', err);
    if (fileOrBlob instanceof Blob) {
      return URL.createObjectURL(fileOrBlob);
    }
    return typeof fileOrBlob === 'string' ? ensureBlobUrl(fileOrBlob) : '';
  }
};

export const getPdfBlobUrlFromIDB = async (id: string, fallbackUrl?: string): Promise<string> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        if (req.result && req.result instanceof Blob) {
          const objectUrl = URL.createObjectURL(req.result);
          resolve(objectUrl);
        } else {
          resolve(ensureBlobUrl(fallbackUrl || ''));
        }
      };
      req.onerror = () => resolve(ensureBlobUrl(fallbackUrl || ''));
    });
  } catch (err) {
    console.error('Erro ao buscar PDF do IndexedDB:', err);
    return ensureBlobUrl(fallbackUrl || '');
  }
};

export const deletePdfFromIDB = async (id: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
  } catch (e) {
    console.error(e);
  }
};
