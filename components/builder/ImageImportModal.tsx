'use client';

import { useState, useCallback, useEffect } from 'react';
import { BuilderNode, BuilderLink, DiagramConfig } from '@/types/builder';

interface ImageImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (nodes: BuilderNode[], links: BuilderLink[], config: DiagramConfig) => void;
}

interface ParsedResult {
  nodes: BuilderNode[];
  links: BuilderLink[];
  config: DiagramConfig;
  metadata?: {
    confidence?: number;
    warnings?: string[];
    notes?: string;
  };
}

export default function ImageImportModal({
  isOpen,
  onClose,
  onImport,
}: ImageImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [contextHints, setContextHints] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Reset state when modal closes
  const handleClose = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setContextHints('');
    setIsProcessing(false);
    setProgress(0);
    setResult(null);
    setError(null);
    onClose();
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle clipboard paste
  const handlePaste = useCallback((e: ClipboardEvent) => {
    // Only handle paste when modal is open and no file is selected
    if (!isOpen) return;
    
    const items = e.clipboardData?.items;
    if (!items) return;

    // Look for an image in clipboard
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          // Create a File from the blob with a default name
          const file = new File([blob], `pasted-image-${Date.now()}.png`, {
            type: blob.type,
          });
          handleFileSelect(file);
        }
        break;
      }
    }
  }, [isOpen]);

  // Add/remove paste event listener
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('paste', handlePaste);
      return () => {
        window.removeEventListener('paste', handlePaste);
      };
    }
  }, [isOpen, handlePaste]);

  // Process the image with AI
  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('contextHints', contextHints);
      formData.append('canvasWidth', '1000');
      formData.append('canvasHeight', '1100');

      setProgress(30);

      // Call API
      const response = await fetch('/api/ai/parse-diagram', {
        method: 'POST',
        body: formData,
      });

      setProgress(70);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to parse diagram');
      }

      setProgress(100);
      setResult(data.data);
    } catch (err: any) {
      console.error('Error processing image:', err);
      setError(err.message || 'An error occurred while processing the image');
    } finally {
      setIsProcessing(false);
    }
  };

  // Import the result into the builder
  const handleImportResult = () => {
    if (result) {
      onImport(result.nodes, result.links, result.config);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Import from Image</h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload a photo or sketch of your Sankey diagram
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!result ? (
            <>
              {/* Upload Zone */}
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-6xl mb-4">📷</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Drop your diagram image here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse, or <strong>paste from clipboard</strong> (Ctrl+V)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                  <p className="text-xs text-gray-500 mt-4">
                    Supports PNG, JPG, WebP • Max 10MB<br />
                    💡 <strong>Tip:</strong> Copy an image (Ctrl+C) and paste it here (Ctrl+V)!
                  </p>
                </div>
              ) : (
                <>
                  {/* Image Preview */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Selected Image
                      </label>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Change Image
                      </button>
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-64 object-contain bg-gray-50 rounded-lg border border-gray-200"
                      />
                    )}
                    <p className="text-xs text-gray-600 mt-1">{selectedFile.name}</p>
                  </div>

                  {/* Context Hints */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Context Hints (Optional)
                    </label>
                    <input
                      type="text"
                      value={contextHints}
                      onChange={(e) => setContextHints(e.target.value)}
                      placeholder="e.g., biochar system with chicken house and processing plant"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Help the AI understand your diagram type for better accuracy
                    </p>
                  </div>

                  {/* Processing State */}
                  {isProcessing && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          AI is analyzing your diagram...
                        </span>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Extracting nodes and flows... This may take 5-10 seconds.
                      </p>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-red-500 text-xl mr-2">⚠️</span>
                        <div>
                          <h4 className="font-semibold text-red-800">Error</h4>
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            /* Result Preview */
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Import Preview
                </h3>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {result.nodes.length}
                    </div>
                    <div className="text-sm text-green-600">Nodes Extracted</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {result.links.length}
                    </div>
                    <div className="text-sm text-blue-600">Links Identified</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {Math.round((result.metadata?.confidence || 0.85) * 100)}%
                    </div>
                    <div className="text-sm text-purple-600">Confidence</div>
                  </div>
                </div>

                {/* Warnings */}
                {result.metadata?.warnings && result.metadata.warnings.length > 0 && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      ⚠️ Warnings
                    </h4>
                    <ul className="space-y-1">
                      {result.metadata.warnings.map((warning, idx) => (
                        <li key={idx} className="text-sm text-yellow-700">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-yellow-600 mt-2">
                      You can refine these in the editor after import
                    </p>
                  </div>
                )}

                {/* Nodes List */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Detected Nodes
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {result.nodes.map((node) => (
                      <div
                        key={node.id}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: node.color }}
                        />
                        {node.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {result.metadata?.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      💡 {result.metadata.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          {!result ? (
            <button
              onClick={handleProcess}
              disabled={!selectedFile || isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Upload & Parse'}
            </button>
          ) : (
            <button
              onClick={handleImportResult}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Import to Editor →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}