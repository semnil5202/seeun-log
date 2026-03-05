'use server';

import type { FlaggedTerm, TranslationResult } from '../types';

export async function extractFlaggedTerms(
  _content: string,
  _placeName?: string,
  _address?: string,
): Promise<FlaggedTerm[]> {
  // TODO: GPT-4o API 연동
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    { original: '두쫀쿠', suggestions: ['Dujeonku', 'Tteok Cookie', 'Dujeunku'] },
    { original: '내돈내산', suggestions: ['Bought with my own money', 'Self-purchased review'] },
    { original: '존맛탱', suggestions: ['Super delicious', 'Incredibly tasty'] },
    { original: '가성비', suggestions: [] },
  ];
}

export async function translatePost(_params: {
  title: string;
  content: string;
  placeName?: string;
  address?: string;
  confirmedTerms: { original: string; confirmed: string }[];
}): Promise<TranslationResult[]> {
  // TODO: GPT-4o API 연동 — 확정 번역 용어를 포함하여 전체 본문 번역
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      locale: 'en',
      title: 'Gangnam Hidden Gem Pasta Restaurant',
      content:
        '<p>Today I visited a pasta restaurant in Gangnam. The Dujeonku was super delicious! This is a self-purchased review, not sponsored.</p><p>The cream pasta and rose pasta were both amazing. Highly recommend for a date spot.</p>',
      place_name: 'Pasta Lab',
      address: '123 Gangnam-daero, Gangnam-gu, Seoul',
    },
    {
      locale: 'ja',
      title: '江南の隠れ家パスタレストラン',
      content:
        '<p>今日は江南のパスタレストランに行ってきました。ドゥジョンクがとても美味しかったです！これは自費レビューで、スポンサーではありません。</p><p>クリームパスタとロゼパスタ、どちらも最高でした。デートスポットとしておすすめです。</p>',
      place_name: 'パスタラボ',
      address: 'ソウル特別市江南区江南大路123',
    },
    {
      locale: 'zh-CN',
      title: '江南隐藏的意面餐厅',
      content:
        '<p>今天去了江南的一家意面餐厅。Dujeonku超级好吃！这是自费评测，不是赞助的。</p><p>奶油意面和玫瑰意面都很棒。强烈推荐作为约会地点。</p>',
      place_name: '意面实验室',
      address: '首尔市江南区江南大路123号',
    },
    {
      locale: 'zh-TW',
      title: '江南隱藏的義大利麵餐廳',
      content:
        '<p>今天去了江南的一家義大利麵餐廳。Dujeonku超級好吃！這是自費評測，不是贊助的。</p><p>奶油義大利麵和玫瑰義大利麵都很棒。強烈推薦作為約會地點。</p>',
      place_name: '義大利麵實驗室',
      address: '首爾市江南區江南大路123號',
    },
    {
      locale: 'id',
      title: 'Restoran Pasta Tersembunyi di Gangnam',
      content:
        '<p>Hari ini saya mengunjungi restoran pasta di Gangnam. Dujeonku-nya sangat enak! Ini adalah ulasan yang dibeli sendiri, bukan sponsor.</p><p>Pasta krim dan pasta rose keduanya luar biasa. Sangat direkomendasikan untuk tempat kencan.</p>',
      place_name: 'Pasta Lab',
      address: '123 Gangnam-daero, Gangnam-gu, Seoul',
    },
    {
      locale: 'vi',
      title: 'Nhà hàng mì Ý ẩn giấu ở Gangnam',
      content:
        '<p>Hôm nay tôi đã ghé thăm một nhà hàng mì Ý ở Gangnam. Dujeonku rất ngon! Đây là đánh giá tự mua, không phải tài trợ.</p><p>Mì kem và mì rose đều tuyệt vời. Rất khuyến khích cho địa điểm hẹn hò.</p>',
      place_name: 'Pasta Lab',
      address: '123 Gangnam-daero, Gangnam-gu, Seoul',
    },
    {
      locale: 'th',
      title: 'ร้านพาสต้าลับในคังนัม',
      content:
        '<p>วันนี้ไปร้านพาสต้าในคังนัม Dujeonku อร่อมมาก! นี่คือรีวิวซื้อเอง ไม่ใช่สปอนเซอร์</p><p>พาสต้าครีมและพาสต้าโรเซ่อร่อยทั้งคู่ แนะนำสำหรับที่เดท</p>',
      place_name: 'Pasta Lab',
      address: '123 Gangnam-daero, Gangnam-gu, Seoul',
    },
  ];
}
