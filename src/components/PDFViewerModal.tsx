import React, { useState, useEffect } from 'react';
import { Manual } from '../types/manual';
import { getBrandTheme } from '../utils/brandStyles';
import { getPdfBlobUrlFromIDB, ensureBlobUrl } from '../utils/pdfStorage';
import { X, Download, Printer, Share2, Wrench, Check, FileText, Cpu, ExternalLink, Eye } from 'lucide-react';

interface PDFViewerModalProps {
  manual: Manual | null;
  onClose: () => void;
  onDownload: (manual: Manual) => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  manual,
  onClose,
  onDownload
}) => {
  const [showTechnicalNotes, setShowTechnicalNotes] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState<string>('');
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);

  useEffect(() => {
    if (manual) {
      setIsLoadingPdf(true);
      getPdfBlobUrlFromIDB(manual.id, manual.fileUrl)
        .then((url) => {
          const finalUrl = ensureBlobUrl(url || manual.fileUrl);
          setActivePdfUrl(finalUrl);
        })
        .catch(() => {
          setActivePdfUrl(ensureBlobUrl(manual.fileUrl));
        })
        .finally(() => {
          setIsLoadingPdf(false);
        });
    } else {
      setActivePdfUrl('');
    }
  }, [manual]);

  if (!manual) return null;

  const brandTheme = getBrandTheme(manual.brand);
  const shareableUrl = `https://manuais.eletrozone.net.br/manual/${manual.id}`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenInNewTab = () => {
    if (activePdfUrl) {
      const w = window.open(activePdfUrl, '_blank');
      if (!w) {
        // Fallback for popup blocker
        const a = document.createElement('a');
        a.href = activePdfUrl;
        a.target = '_blank';
        a.click();
      }
    } else {
      alert('Arquivo PDF não localizado. Por favor, faça o upload do arquivo novamente no cadastro do manual.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg overflow-hidden">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full h-[94vh] max-w-6xl overflow-hidden shadow-2xl flex flex-col animate-modal">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between gap-4">
          
          {/* Document Title & Meta */}
          <div className="flex items-center gap-3 overflow-hidden">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase shrink-0 ${brandTheme.badgeBg}`}>
              {manual.brand}
            </span>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-white truncate flex items-center gap-2">
                {manual.title}
                <span className="text-xs font-mono text-red-400 font-normal shrink-0">
                  [{manual.model}]
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 flex items-center gap-2">
                <span>Versão: {manual.version}</span>
                <span>&bull;</span>
                <span className="text-red-300 font-mono">manuais.eletrozone.net.br</span>
              </p>
            </div>
          </div>

          {/* Controls & Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {activePdfUrl && (
              <button
                onClick={handleOpenInNewTab}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                title="Abrir PDF Completo em Nova Aba"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Abrir PDF em Nova Aba</span>
              </button>
            )}

            {manual.wiringDiagramNotes && (
              <button
                onClick={() => setShowTechnicalNotes(!showTechnicalNotes)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  showTechnicalNotes
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden md:inline">Painel Técnico</span>
              </button>
            )}

            <button
              onClick={handleCopyShareLink}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors text-xs flex items-center gap-1"
              title="Copiar Link direto para Técnicos"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
              title="Imprimir Manual"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDownload(manual)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar ({manual.fileSize})
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Main PDF Frame / Fallback Viewer */}
          <div className="flex-1 bg-zinc-950 flex flex-col relative overflow-hidden">
            
            {/* Embedded Frame */}
            <div className="flex-1 w-full h-full p-2 relative">
              {isLoadingPdf ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-3">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-mono">Carregando arquivo PDF...</span>
                </div>
              ) : activePdfUrl && !activePdfUrl.includes('dummy.pdf') ? (
                <iframe
                  src={activePdfUrl}
                  title={manual.title}
                  className="w-full h-full rounded-2xl border border-zinc-800 bg-white"
                />
              ) : (
                /* Clear Fallback Banner when file needs direct opening */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Visualizar Documento PDF ({manual.fileSize})</h4>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto">
                      O arquivo de manual está carregado e pronto. Clique no botão abaixo para abrir a leitura completa em alta definição.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleOpenInNewTab}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar PDF em Nova Aba
                    </button>
                    <button
                      onClick={() => onDownload(manual)}
                      className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Baixar Arquivo ({manual.fileSize})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Floating Bar */}
            <div className="p-2 bg-zinc-950/90 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 px-4">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-red-500" />
                <span>Formato: PDF Document</span>
                <span>&bull;</span>
                <span>Tamanho: {manual.fileSize}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenInNewTab}
                  className="text-red-400 hover:underline flex items-center gap-1 font-bold text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir PDF em nova aba
                </button>
              </div>
            </div>
          </div>

          {/* Technical Side Drawer */}
          {showTechnicalNotes && manual.wiringDiagramNotes && (
            <div className="w-80 lg:w-96 bg-zinc-900 border-l border-zinc-800 p-5 overflow-y-auto space-y-5 shrink-0">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Esquema & Jumpers de Bancada
                </h3>
                <button
                  onClick={() => setShowTechnicalNotes(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs"
                >
                  Ocultar
                </button>
              </div>

              {/* Wiring Notes Content */}
              <div className="space-y-3">
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    Ligação dos Bornes & Conectores:
                  </h4>
                  <pre className="text-[11px] text-zinc-300 code-font whitespace-pre-wrap leading-relaxed">
                    {manual.wiringDiagramNotes}
                  </pre>
                </div>
              </div>

              {/* Jumpers Table */}
              {manual.jumperSettings && manual.jumperSettings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-300">
                    Tabela de Configuração de Jumpers:
                  </h4>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-900 text-[10px] text-zinc-400 font-mono uppercase border-b border-zinc-800">
                          <th className="p-2 font-bold">Jumper</th>
                          <th className="p-2 font-bold">Função</th>
                          <th className="p-2 font-bold">Padrão</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 text-[11px]">
                        {manual.jumperSettings.map((j, idx) => (
                          <tr key={idx} className="hover:bg-zinc-900/40">
                            <td className="p-2 font-bold text-red-400 code-font">{j.dip}</td>
                            <td className="p-2 text-zinc-300">{j.function}</td>
                            <td className="p-2 text-amber-400 code-font">{j.defaultVal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Share Note */}
              <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-xl text-[11px] text-red-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-red-400" /> Link Técnico Eletrozone
                </p>
                <p className="text-zinc-400 text-[10px]">
                  Envie este manual diretamente via WhatsApp para sua equipe de campo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
