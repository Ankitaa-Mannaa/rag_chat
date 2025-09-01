import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileDropZone from "../components/FileDropZone";
import { listDocsThunk, uploadDocThunk } from "../store/slices/docSlice";

export default function Documents() {
  const dispatch = useDispatch();
  const { items, loading, error, uploaded } = useSelector((s) => s.documents);
  const [sel, setSel] = useState(null);

  useEffect(()=>{ dispatch(listDocsThunk()); }, [dispatch, uploaded]);

  const onFile = (file) => { setSel(file); };
  const onUpload = () => { if (sel) dispatch(uploadDocThunk(sel)); };

  // Get file extension for icon
  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📕';
      case 'doc':
      case 'docx': return '📘';
      case 'txt': return '📄';
      case 'xlsx':
      case 'xls': return '📊';
      case 'pptx':
      case 'ppt': return '📋';
      default: return '📄';
    }
  };

  const formatFileSize = (size) => {
    if (!size) return '';
    if (typeof size === 'string') return size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="h-auto p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-blue-700 bg-clip-text text-transparent mb-2">
            Document Management
          </h1>
          <p className="text-gray-600 font-medium">Upload, organize, and manage your documents for AI analysis</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Upload Section */}
          <div className="relative">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 relative overflow-hidden">

              {/* Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
                  <p className="text-sm text-gray-600">Drag & drop or click to select files</p>
                </div>
              </div>

              {/* File Drop Zone */}
              <div className="mb-6">
                <FileDropZone onFile={onFile} />
              </div>

              {/* Selected File */}
              {sel && (
                <div className="p-4 bg-purple-50/80 border border-purple-200/60 rounded-xl backdrop-blur-sm mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <span className="text-2xl">{getFileIcon(sel.name)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {sel.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(sel.size)} • Ready to upload
                        </p>
                      </div>
                    </div>
                    <button 
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed" 
                      onClick={onUpload} 
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span>Upload</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {error && (
                <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl backdrop-blur-sm mb-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-800">Upload Failed</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {uploaded && (
                <div className="p-4 bg-green-50/80 border border-green-200 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Upload Successful!</p>
                      <p className="text-sm text-green-700">Your document has been processed and is ready for analysis</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Tips */}
              <div className="mt-6 p-4 bg-blue-50/60 rounded-xl border border-blue-200/60">
                <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5v3a.75.75 0 001.5 0v-3A.75.75 0 009 9z" clipRule="evenodd"/>
                  </svg>
                  Supported formats:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                  <span>📕 PDF documents</span>
                  <span>📘 Word files (.doc, .docx)</span>
                  <span>📄 Text files (.txt)</span>
                  <span>📊 Excel files (.xlsx, .xls)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="relative">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 relative overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Documents</h2>
                    <p className="text-sm text-gray-600">{items?.length || 0} documents ready for analysis</p>
                  </div>
                </div>
                
                {/* Document count badge */}
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  {items?.length || 0} files
                </div>
              </div>

              {/* Loading State */}
              {loading && items.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading your documents...</p>
                </div>
              )}

              {/* Documents List */}
              <div className="space-y-3">
                {items?.map((d, index) => (
                  <div 
                    key={d.id} 
                    className="group p-4 bg-white/70 hover:bg-white/90 border border-white/60 hover:border-purple-200/60 rounded-xl backdrop-blur-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        {/* File Icon */}
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <span className="text-lg">{getFileIcon(d.name)}</span>
                        </div>
                        
                        {/* File Info */}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate group-hover:text-purple-900 transition-colors">
                            {d.name || `Document #${d.id}`}
                          </p>
                          <div className="flex items-center space-x-3 mt-1">
                            <p className="text-xs text-gray-500 font-mono">
                              ID: {d.id}
                            </p>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <div className="flex items-center space-x-1">
                              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                              <span className="text-xs text-green-600 font-medium">Processed</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* File Size and Actions */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 font-medium bg-gray-100/80 px-3 py-1 rounded-full">
                          {formatFileSize(d.size_readable || d.size)}
                        </span>
                        
                        {/* Action Menu */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-gray-600 hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {items?.length === 0 && !loading && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No documents yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      Upload your first document to start analyzing with AI-powered insights
                    </p>
                    <div className="inline-flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">Drag a file to get started</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200/60">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-purple-600">{items?.length || 0}</div>
                    <div className="text-xs text-gray-500 font-medium">Total Files</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-green-600">100%</div>
                    <div className="text-xs text-gray-500 font-medium">Processed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}