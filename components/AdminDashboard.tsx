import React from 'react';
import { Inquiry, InquiryStatus } from '../types';
import { CheckCircle, Clock, XCircle, AlertCircle, Phone, MapPin } from 'lucide-react';

interface AdminDashboardProps {
  inquiries: Inquiry[];
  onUpdateStatus: (id: string, status: InquiryStatus) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ inquiries, onUpdateStatus, onClose }) => {
  
  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case InquiryStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case InquiryStatus.REVIEWING: return 'bg-blue-100 text-blue-800';
      case InquiryStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case InquiryStatus.CANCELLED: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 overflow-y-auto">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">管理画面 - 問い合わせ一覧</h1>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
          >
            LPに戻る
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {inquiries.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow">
              <p className="text-gray-500">まだ問い合わせはありません。</p>
            </div>
          ) : (
            inquiries.slice().reverse().map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleString('ja-JP')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{inquiry.name} 様</h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select 
                        value={inquiry.status}
                        onChange={(e) => onUpdateStatus(inquiry.id, e.target.value as InquiryStatus)}
                        className="text-sm border-gray-300 border rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.values(InquiryStatus).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-1" />
                        <span className="text-gray-700">{inquiry.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <span className="text-gray-700">{inquiry.address}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-1" />
                        <span className="text-gray-700">希望日時: {inquiry.preferredDate ? new Date(inquiry.preferredDate).toLocaleString('ja-JP') : '指定なし'}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                        <span className="font-semibold block mb-1">備考・内容:</span>
                        {inquiry.itemsDescription || 'なし'}
                      </div>
                      {inquiry.aiEstimate && (
                        <div className="bg-purple-50 p-3 rounded-md text-sm border border-purple-100">
                          <span className="font-semibold text-purple-700 block mb-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> AI見積もり結果:
                          </span>
                          {inquiry.aiEstimate}
                        </div>
                      )}
                    </div>

                    {inquiry.imagePreviewUrl && (
                      <div className="border rounded-lg p-2 bg-gray-50 flex items-center justify-center">
                        <img 
                          src={inquiry.imagePreviewUrl} 
                          alt="Uploaded Junk" 
                          className="max-h-64 object-contain rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
