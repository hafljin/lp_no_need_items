import { Plan, Review, FAQItem } from './types';

export const PLANS: Plan[] = [
  {
    id: 'light',
    name: '軽トラパック',
    price: '9,800円〜',
    capacity: '押入れ1間分程度',
    features: ['単身引越しに最適', '即日対応可能', '作業員1名'],
    recommended: false,
  },
  {
    id: 'standard',
    name: '1tトラックパック',
    price: '24,800円〜',
    capacity: '1K〜1DK程度',
    features: ['大型家具もOK', '家電リサイクル対応', '作業員1-2名'],
    recommended: true,
  },
  {
    id: 'large',
    name: '2tトラックパック',
    price: '49,800円〜',
    capacity: '2DK〜2LDK程度',
    features: ['家まるごと整理', 'ゴミ屋敷対応', '作業員2-3名'],
    recommended: false,
  },
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "田中様 (30代男性)",
    rating: 5,
    comment: "急な引越しで困っていましたが、連絡したその日に来てくれて助かりました。料金も事前のLINE見積もり通りでした。",
    date: "2024/05/10"
  },
  {
    id: 2,
    name: "佐藤様 (50代女性)",
    rating: 5,
    comment: "実家の整理をお願いしました。スタッフの方がとても親切で、テキパキと作業してくれました。また利用したいです。",
    date: "2024/04/22"
  },
  {
    id: 3,
    name: "鈴木様 (20代男性)",
    rating: 4,
    comment: "深夜の問い合わせにも関わらず、翌朝すぐに返信がありました。AI見積もりが便利で大体の金額がわかって安心でした。",
    date: "2024/06/01"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "当日の追加料金はかかりますか？",
    answer: "基本的には見積もり確定後の追加料金はいただきません。ただし、当日回収品が大幅に増えた場合は、作業前にご相談させていただきます。"
  },
  {
    question: "雨の日でも作業可能ですか？",
    answer: "はい、雨天でも作業可能です。お品物が濡れないよう配慮して搬出いたします。"
  },
  {
    question: "分別していないゴミでも大丈夫ですか？",
    answer: "はい、問題ありません。スタッフが分別作業から行いますので、そのままの状態でお待ちください。"
  },
  {
    question: "対応エリアを教えてください。",
    answer: "東京都全域、神奈川県、埼玉県、千葉県の一部地域に対応しております。詳細はお電話にてお問い合わせください。"
  }
];
