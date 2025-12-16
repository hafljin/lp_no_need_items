import React, { useState, useEffect } from 'react';
import { Truck, Check, Phone, MessageCircle, Menu, X, Star, ChevronDown, ChevronUp, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { PLANS, REVIEWS, FAQS } from './constants';
import { InquiryForm } from './components/InquiryForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Inquiry, InquiryStatus } from './types';
import { generateImage } from './services/geminiService';

// Image prompts for realistic Japanese home scenarios
const GALLERY_PROMPTS = {
  case1Before: "A cluttered Japanese living room, messy, piles of magazines and cardboard boxes, kotatsu buried under trash, tatami mats visible, chaotic atmosphere, realistic photo style",
  case1After: "A clean and empty Japanese living room, tatami mats, sliding doors (shoji), sunlight streaming in, minimalist, tidy, realistic photo style",
  case2Before: "A messy Japanese kitchen, overflowing trash bags, dirty dishes piled up, cramped space, realistic photo style",
  case2After: "A sparkling clean Japanese kitchen, organized, shiny surfaces, modern appliances, tidy, realistic photo style"
};

function App() {
  const [currentView, setCurrentView] = useState<'lp' | 'admin'>('lp');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  
  // 固定画像URLを直接セット（AI生成なし）
  const [galleryImages] = useState<{ [key: string]: string | null }>({
    // 事例1: ゴミ屋敷清掃（和室）
    case1Before: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", // cluttered room
    case1After: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80", // clean tatami room
    // 事例2: キッチン片付け
    case2Before: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80", // messy kitchen
    case2After: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80" // clean kitchen
  });

  // Load inquiries from localStorage on mount (mock persistence)
  useEffect(() => {
    const saved = localStorage.getItem('eco_clean_inquiries');
    if (saved) {
      setInquiries(JSON.parse(saved));
    }
  }, []);

  // Save inquiries when changed
  useEffect(() => {
    localStorage.setItem('eco_clean_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const handleInquirySubmit = (formData: any) => {
    const newInquiry: Inquiry = {
      id: Date.now().toString(),
      ...formData,
      status: InquiryStatus.PENDING,
      createdAt: Date.now()
    };
    setInquiries([...inquiries, newInquiry]);
    setShowSubmissionSuccess(true);
    setTimeout(() => setShowSubmissionSuccess(false), 5000);
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (currentView === 'admin') {
    return (
      <AdminDashboard 
        inquiries={inquiries} 
        onUpdateStatus={updateInquiryStatus} 
        onClose={() => setCurrentView('lp')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pb-20 md:pb-0">
      
      {/* Success Modal */}
      {showSubmissionSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">送信完了！</h3>
            <p className="text-gray-600 mb-6">お問い合わせありがとうございます。<br/>担当者より順次ご連絡いたします。</p>
            <button 
              onClick={() => setShowSubmissionSuccess(false)}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-bold"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-blue-900">EcoClean</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600">選ばれる理由</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600">料金プラン</a>
            <a href="#reviews" className="text-sm font-medium text-gray-600 hover:text-blue-600">お客様の声</a>
            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-blue-600">よくある質問</a>
            <button 
              onClick={() => setCurrentView('admin')}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              管理
            </button>
          </nav>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4">
            <a href="#features" className="block text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>選ばれる理由</a>
            <a href="#pricing" className="block text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>料金プラン</a>
            <a href="#reviews" className="block text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>お客様の声</a>
            <a href="#contact" className="block text-blue-600 font-bold" onClick={() => setIsMenuOpen(false)}>お問い合わせ</a>
            <button onClick={() => setCurrentView('admin')} className="block text-gray-400 text-sm mt-4">管理者ログイン</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10 text-center md:text-left">
            <div className="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-4">
              地域密着！即日対応OK
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
              不用品の処分、<br/>
              <span className="text-blue-600">まるごとお任せ</span><br/>
              ください！
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              重い家具も、大量のゴミも、分別不要でプロが回収。最短30分で駆けつけます。AI見積もりで事前確認も安心。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#contact" className="px-8 py-4 bg-orange-500 text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg">
                <Truck className="w-5 h-5" />
                まずは無料見積もり
              </a>
              <button className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5" />
                LINEで相談
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            <img 
              src="https://picsum.photos/800/600?random=1" 
              alt="Clean Worker" 
              className="relative rounded-2xl shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">EcoCleanが選ばれる3つの理由</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">最短30分の即日対応</h3>
              <p className="text-gray-600">お急ぎの方も安心。地域密着だからできるスピード対応で、今日中にスッキリ片付けます。</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">明朗会計・追加なし</h3>
              <p className="text-gray-600">作業前に確定した見積もり以上の金額はいただきません。安心のパック料金プラン。</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">清潔感のあるプロ対応</h3>
              <p className="text-gray-600">研修を受けたプロスタッフが、丁寧かつ迅速に作業。プライバシーにも配慮します。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">お得な定額パックプラン</h2>
            <p className="text-gray-600">荷物の量に合わせて最適なプランをご提案します。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${plan.recommended ? 'border-orange-500 transform md:-translate-y-4' : 'border-transparent'}`}>
                {plan.recommended && (
                  <div className="bg-orange-500 text-white text-center py-1 text-sm font-bold">
                    一番人気！
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-black text-blue-600 mb-4">{plan.price}</div>
                  <p className="text-sm text-gray-500 mb-6 border-b pb-4">目安: {plan.capacity}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500" /> {feat}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className={`block w-full text-center py-3 rounded-lg font-bold transition-colors ${plan.recommended ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    このプランで相談
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">作業実績 Before/After</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
              <h3 className="font-bold mb-2">事例1: ゴミ屋敷清掃（和室）</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                  {galleryImages.case1Before ? (
                    <img src={galleryImages.case1Before} alt="Before Living Room" className="w-full h-full object-cover grayscale" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <span className="text-xs">画像を生成中...</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">Before</span>
                </div>
                <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                   {galleryImages.case1After ? (
                    <img src={galleryImages.case1After} alt="After Living Room" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <span className="text-xs">画像を生成中...</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">After</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
              <h3 className="font-bold mb-2">事例2: キッチン片付け</h3>
              <div className="grid grid-cols-2 gap-2">
                 <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                  {galleryImages.case2Before ? (
                    <img src={galleryImages.case2Before} alt="Before Kitchen" className="w-full h-full object-cover grayscale" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <span className="text-xs">画像を生成中...</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">Before</span>
                </div>
                <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                   {galleryImages.case2After ? (
                    <img src={galleryImages.case2After} alt="After Kitchen" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <span className="text-xs">画像を生成中...</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">After</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">お客様の声</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-1 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">"{review.comment}"</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="font-bold text-gray-800">{review.name}</span>
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">よくある質問</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-bold text-gray-800 text-left">Q. {faq.question}</span>
                  {openFaqIndex === index ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-gray-600 text-sm">
                    <span className="font-bold text-blue-600 mr-2">A.</span>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <InquiryForm onSubmit={handleInquirySubmit} />

      {/* Sticky Mobile Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 md:hidden z-40 flex gap-2">
        <a href="tel:0120-000-000" className="flex-1 bg-green-500 text-white font-bold rounded-lg py-3 flex flex-col items-center justify-center leading-none">
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-xs">電話で相談</span>
        </a>
        <a href="#contact" className="flex-1 bg-orange-500 text-white font-bold rounded-lg py-3 flex flex-col items-center justify-center leading-none">
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-xs">Web見積もり</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 md:pb-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">EcoClean</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              地域密着型の不用品回収サービス。<br/>
              お客様の「困った」を迅速・丁寧に解決します。<br/>
              古物商許可証 第123456789号
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white">選ばれる理由</a></li>
              <li><a href="#pricing" className="hover:text-white">料金プラン</a></li>
              <li><a href="#reviews" className="hover:text-white">お客様の声</a></li>
              <li><a href="#faq" className="hover:text-white">よくある質問</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">お問い合わせ</h4>
            <p className="text-sm mb-2">お電話: 0120-000-000</p>
            <p className="text-sm mb-2">営業時間: 9:00 - 20:00</p>
            <p className="text-sm">年中無休（年末年始を除く）</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} EcoClean Direct. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;