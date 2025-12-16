import React, { useState, useRef } from 'react';
import { Camera, Loader2, Send, Upload, Sparkles } from 'lucide-react';
import { estimateQuote } from '../services/geminiService';

interface InquiryFormProps {
  onSubmit: (data: any) => void;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [itemsDescription, setItemsDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // AI State
  const [isEstimating, setIsEstimating] = useState(false);
  const [aiResult, setAiResult] = useState<{ priceRange: string; reasoning: string; planRecommendation: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setAiResult(null); // Reset previous estimate on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiEstimate = async () => {
    if (!previewUrl || !selectedFile) return;
    
    setIsEstimating(true);
    try {
      // Remove data:image/xxx;base64, prefix
      const base64Data = previewUrl.split(',')[1];
      const result = await estimateQuote(base64Data, itemsDescription || "不用品回収の依頼です。");
      setAiResult(result);
    } catch (e) {
      console.error(e);
      alert("AI見積もりに失敗しました。再度お試しください。");
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate converting file to base64 for storage if needed, or just pass previewUrl
    const formData = {
      name,
      phone,
      address,
      preferredDate,
      itemsDescription,
      imagePreviewUrl: previewUrl,
      imageBase64: previewUrl ? previewUrl.split(',')[1] : undefined,
      aiEstimate: aiResult ? `${aiResult.planRecommendation} (${aiResult.priceRange})` : undefined
    };
    onSubmit(formData);
    
    // Reset form
    setName('');
    setPhone('');
    setAddress('');
    setPreferredDate('');
    setItemsDescription('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setAiResult(null);
  };

  return (
    <section id="contact" className="py-16 px-4 bg-gray-50">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">無料お問い合わせ</h2>
          <p className="text-blue-100 text-sm">最短30分で駆けつけます！AIによる概算見積もりも可能。</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              不用品の写真 (AI見積もり対応)
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative w-full h-48">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-md" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                    <span className="text-white font-medium">変更する</span>
                  </div>
                </div>
              ) : (
                <>
                  <Camera className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">タップして写真を撮影または選択</p>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>

            {/* AI Estimation Button */}
            {previewUrl && !aiResult && (
              <button
                type="button"
                onClick={handleAiEstimate}
                disabled={isEstimating}
                className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                {isEstimating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AIが画像を解析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AIで概算見積もりを見る
                  </>
                )}
              </button>
            )}

            {/* AI Result Display */}
            {aiResult && (
              <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-purple-900">AI概算見積もり結果</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">推奨プラン</p>
                    <p className="font-bold text-gray-800">{aiResult.planRecommendation}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">概算費用</p>
                    <p className="font-bold text-red-600">{aiResult.priceRange}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600 border-t border-purple-100 pt-2">
                  <span className="font-semibold">AIコメント:</span> {aiResult.reasoning}
                </p>
                <p className="mt-2 text-[10px] text-gray-400 text-right">※実際の費用は現地確認後に確定します。</p>
              </div>
            )}
          </div>

          {/* Text Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">お名前 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="例: 山田 太郎" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話番号 <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="例: 090-1234-5678" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ご住所 <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="例: 東京都渋谷区..." 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">希望日時</label>
            <input 
              type="datetime-local" 
              value={preferredDate} 
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">不用品の内容・備考</label>
            <textarea 
              rows={3} 
              value={itemsDescription} 
              onChange={(e) => setItemsDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="例: 冷蔵庫、洗濯機、ベッドマットなど" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            この内容で問い合わせる
          </button>

        </form>
      </div>
    </section>
  );
};
