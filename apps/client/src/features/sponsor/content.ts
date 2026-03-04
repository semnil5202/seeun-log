import type { Locale } from '@/shared/types/common';
import { SITE_NAME_KO, SITE_NAME_EN } from '@eunminlog/config/site';

type StatItem = {
  value: string;
  label: string;
};

type CollaborationType = {
  title: string;
  description: string;
  icon: string;
};

type SeoFeature = {
  title: string;
  description: string;
};

type SponsorContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    headline: string;
    subtext: string;
    cta: string;
  };
  blogIntro: {
    heading: string;
    paragraphs: string[];
  };
  seoStrengths: {
    heading: string;
    subtext: string;
    multilingual: {
      heading: string;
      description: string;
    };
    features: SeoFeature[];
  };
  stats: {
    heading: string;
    items: StatItem[];
  };
  collaboration: {
    heading: string;
    subtext: string;
    types: CollaborationType[];
  };
  cta: {
    heading: string;
    subtext: string;
    buttonLabel: string;
    mailto: {
      subject: string;
      body: string;
    };
  };
};

// TODO: 실제 이메일로 교체
const CONTACT_EMAIL = 'test@test.com';

const SPONSOR: Record<Locale, SponsorContent> = {
  ko: {
    meta: {
      title: '협찬 문의',
      description: `${SITE_NAME_KO}는 맛집, 카페, 여행 콘텐츠를 8개 언어로 제공하는 커플 블로그입니다. 협찬 및 광고 문의를 받고 있습니다.`,
    },
    hero: {
      headline: '함께 성장할\n파트너를 찾고 있어요',
      subtext: `${SITE_NAME_KO}는 한국의 맛집, 카페, 여행 콘텐츠를 8개 언어로 전 세계에 전달하는 커플 블로그입니다.`,
      cta: '협찬 문의하기',
    },
    blogIntro: {
      heading: '은민로그를 소개합니다',
      paragraphs: [
        '저희는 서울과 전국 각지의 맛집, 카페, 여행지를 직접 방문하고 솔직한 리뷰를 작성하는 커플 블로거입니다.',
        '한식, 양식, 일식, 카페, 국내외 여행 등 다양한 카테고리의 콘텐츠를 제작하며, 모든 콘텐츠는 8개 언어로 자동 번역되어 해외 독자에게도 도달합니다.',
      ],
    },
    seoStrengths: {
      heading: '글로벌 도달, 기술적 SEO',
      subtext: '단순 블로그가 아닌, 검색 엔진에 최적화된 기술 기반 콘텐츠 플랫폼입니다.',
      multilingual: {
        heading: '8개 언어 다국어 지원',
        description:
          '한국어, 영어, 일본어, 중국어(간체/번체), 인도네시아어, 베트남어, 태국어',
      },
      features: [
        {
          title: '정적 사이트 생성 (SSG)',
          description: '빌드 타임에 모든 페이지를 사전 생성하여 빠른 로딩 속도를 보장합니다.',
        },
        {
          title: 'JSON-LD 구조화 데이터',
          description:
            'BlogPosting, Review, BreadcrumbList 등 풍부한 구조화 데이터로 검색 결과에서 눈에 띕니다.',
        },
        {
          title: 'Hreflang 태그',
          description:
            '8개 언어별 페이지 간 올바른 언어 관계를 검색 엔진에 전달합니다.',
        },
        {
          title: 'XML Sitemap',
          description:
            '모든 언어의 모든 페이지가 사이트맵에 포함되어 색인 효율을 높입니다.',
        },
      ],
    },
    stats: {
      heading: '숫자로 보는 은민로그',
      // TODO: 실제 GA4 데이터로 교체
      items: [
        { value: '10,000+', label: '월간 방문자' },
        { value: '8', label: '지원 언어' },
        { value: '50+', label: '게시된 리뷰' },
        { value: '3', label: '콘텐츠 카테고리' },
      ],
    },
    collaboration: {
      heading: '협업 방식',
      subtext: '다양한 형태의 협업이 가능합니다.',
      types: [
        {
          title: '협찬 리뷰',
          description:
            '제품 또는 서비스를 체험하고 솔직한 리뷰를 8개 언어로 게시합니다.',
          icon: '📝',
        },
        {
          title: '체험 방문',
          description: '매장이나 여행지를 직접 방문하여 생생한 후기를 작성합니다.',
          icon: '📍',
        },
        {
          title: '배너 광고',
          description: '사이트 내 적절한 위치에 배너 광고를 게재합니다.',
          icon: '📢',
        },
      ],
    },
    cta: {
      heading: '협찬 문의하기',
      subtext: '아래 버튼을 눌러 이메일을 보내주시면 빠르게 답변 드리겠습니다.',
      buttonLabel: '이메일로 문의하기',
      mailto: {
        subject: `[${SITE_NAME_EN}] 협찬 문의`,
        body:
          `안녕하세요, ${SITE_NAME_KO} 팀에게 협찬 문의드립니다.\n\n` +
          '1. 업체명/브랜드명:\n' +
          '2. 협업 유형 (협찬 리뷰 / 체험 방문 / 배너 광고 / 기타):\n' +
          '3. 예산 범위:\n' +
          '4. 희망 일정:\n' +
          '5. 기타 전달 사항:\n',
      },
    },
  },
  en: {
    meta: {
      title: 'Sponsorship Inquiry',
      description: `${SITE_NAME_EN} is a couples blog offering food, cafe, and travel content in 8 languages. We welcome sponsorship and advertising inquiries.`,
    },
    hero: {
      headline: 'Looking for Partners\nto Grow Together',
      subtext: `${SITE_NAME_EN} is a couples blog delivering Korean food, cafe, and travel content to the world in 8 languages.`,
      cta: 'Inquire About Sponsorship',
    },
    blogIntro: {
      heading: `About ${SITE_NAME_EN}`,
      paragraphs: [
        'We are a couple of bloggers who personally visit restaurants, cafes, and travel destinations across Seoul and Korea, writing honest reviews.',
        'We create content across various categories including Korean, Western, and Japanese cuisine, cafes, and domestic/international travel. All content is automatically translated into 8 languages to reach international readers.',
      ],
    },
    seoStrengths: {
      heading: 'Global Reach, Technical SEO',
      subtext:
        'Not just a blog, but a technology-driven content platform optimized for search engines.',
      multilingual: {
        heading: '8-Language Multilingual Support',
        description:
          'Korean, English, Japanese, Chinese (Simplified/Traditional), Indonesian, Vietnamese, Thai',
      },
      features: [
        {
          title: 'Static Site Generation (SSG)',
          description:
            'All pages are pre-generated at build time, ensuring fast loading speeds.',
        },
        {
          title: 'JSON-LD Structured Data',
          description:
            'Rich structured data including BlogPosting, Review, and BreadcrumbList for enhanced search results.',
        },
        {
          title: 'Hreflang Tags',
          description:
            'Properly communicates language relationships between pages in 8 languages to search engines.',
        },
        {
          title: 'XML Sitemap',
          description:
            'All pages in all languages are included in the sitemap for efficient indexing.',
        },
      ],
    },
    stats: {
      heading: `${SITE_NAME_EN} in Numbers`,
      // TODO: Replace with actual GA4 data
      items: [
        { value: '10,000+', label: 'Monthly Visitors' },
        { value: '8', label: 'Languages' },
        { value: '50+', label: 'Published Reviews' },
        { value: '3', label: 'Content Categories' },
      ],
    },
    collaboration: {
      heading: 'Collaboration Options',
      subtext: 'Various forms of collaboration are available.',
      types: [
        {
          title: 'Sponsored Review',
          description:
            'Experience your product or service and publish an honest review in 8 languages.',
          icon: '📝',
        },
        {
          title: 'Experience Visit',
          description:
            'Visit your venue or destination in person and write a vivid review.',
          icon: '📍',
        },
        {
          title: 'Banner Advertising',
          description: 'Place banner ads in suitable positions on our site.',
          icon: '📢',
        },
      ],
    },
    cta: {
      heading: 'Get in Touch',
      subtext:
        'Click the button below to send us an email and we will get back to you promptly.',
      buttonLabel: 'Send Email Inquiry',
      mailto: {
        subject: `[${SITE_NAME_EN}] Sponsorship Inquiry`,
        body:
          `Hello, I'd like to inquire about sponsorship with ${SITE_NAME_EN}.\n\n` +
          '1. Company/Brand name:\n' +
          '2. Collaboration type (Sponsored review / Experience visit / Banner ad / Other):\n' +
          '3. Budget range:\n' +
          '4. Preferred timeline:\n' +
          '5. Additional notes:\n',
      },
    },
  },
  ja: {
    meta: {
      title: '協賛お問い合わせ',
      description: `${SITE_NAME_EN}は、グルメ、カフェ、旅行コンテンツを8言語で提供するカップルブログです。協賛・広告のお問い合わせを受け付けています。`,
    },
    hero: {
      headline: '一緒に成長する\nパートナーを探しています',
      subtext: `${SITE_NAME_EN}は、韓国のグルメ、カフェ、旅行コンテンツを8言語で世界に届けるカップルブログです。`,
      cta: '協賛のお問い合わせ',
    },
    blogIntro: {
      heading: `${SITE_NAME_EN}のご紹介`,
      paragraphs: [
        '私たちはソウルと韓国各地のレストラン、カフェ、観光地を直接訪問し、正直なレビューを書くカップルブロガーです。',
        '韓国料理、洋食、和食、カフェ、国内外の旅行など、さまざまなカテゴリのコンテンツを制作しています。すべてのコンテンツは8言語に自動翻訳され、海外の読者にも届きます。',
      ],
    },
    seoStrengths: {
      heading: 'グローバルリーチ、技術的SEO',
      subtext:
        '単なるブログではなく、検索エンジンに最適化された技術基盤のコンテンツプラットフォームです。',
      multilingual: {
        heading: '8言語多言語対応',
        description:
          '韓国語、英語、日本語、中国語（簡体字/繁体字）、インドネシア語、ベトナム語、タイ語',
      },
      features: [
        {
          title: '静的サイト生成（SSG）',
          description:
            'ビルド時にすべてのページを事前生成し、高速な読み込みを保証します。',
        },
        {
          title: 'JSON-LD構造化データ',
          description:
            'BlogPosting、Review、BreadcrumbListなどの豊富な構造化データで検索結果で目立ちます。',
        },
        {
          title: 'Hreflangタグ',
          description:
            '8言語間のページの言語関係を検索エンジンに正しく伝えます。',
        },
        {
          title: 'XMLサイトマップ',
          description:
            'すべての言語のすべてのページがサイトマップに含まれ、インデックス効率を高めます。',
        },
      ],
    },
    stats: {
      heading: `数字で見る${SITE_NAME_EN}`,
      // TODO: 実際のGA4データに置き換え
      items: [
        { value: '10,000+', label: '月間訪問者' },
        { value: '8', label: '対応言語' },
        { value: '50+', label: '公開レビュー' },
        { value: '3', label: 'コンテンツカテゴリ' },
      ],
    },
    collaboration: {
      heading: 'コラボレーション方法',
      subtext: 'さまざまな形のコラボレーションが可能です。',
      types: [
        {
          title: '協賛レビュー',
          description:
            '製品やサービスを体験し、正直なレビューを8言語で公開します。',
          icon: '📝',
        },
        {
          title: '体験訪問',
          description: '店舗や観光地を直接訪問し、生き生きとしたレビューを書きます。',
          icon: '📍',
        },
        {
          title: 'バナー広告',
          description: 'サイト内の適切な位置にバナー広告を掲載します。',
          icon: '📢',
        },
      ],
    },
    cta: {
      heading: 'お問い合わせ',
      subtext:
        '下のボタンを押してメールをお送りいただければ、迅速にご返信いたします。',
      buttonLabel: 'メールで問い合わせる',
      mailto: {
        subject: `[${SITE_NAME_EN}] 協賛お問い合わせ`,
        body:
          `こんにちは、${SITE_NAME_EN}チームに協賛のお問い合わせをいたします。\n\n` +
          '1. 会社名/ブランド名:\n' +
          '2. コラボレーションの種類（協賛レビュー / 体験訪問 / バナー広告 / その他）:\n' +
          '3. 予算範囲:\n' +
          '4. 希望スケジュール:\n' +
          '5. その他の連絡事項:\n',
      },
    },
  },
  'zh-CN': {
    meta: {
      title: '赞助咨询',
      description: `${SITE_NAME_EN}是一个以8种语言提供美食、咖啡厅、旅行内容的情侣博客。欢迎赞助和广告咨询。`,
    },
    hero: {
      headline: '寻找共同成长的\n合作伙伴',
      subtext: `${SITE_NAME_EN}是一个以8种语言向全世界传递韩国美食、咖啡厅、旅行内容的情侣博客。`,
      cta: '赞助咨询',
    },
    blogIntro: {
      heading: `关于${SITE_NAME_EN}`,
      paragraphs: [
        '我们是一对情侣博主，亲自走访首尔及韩国各地的餐厅、咖啡厅和旅游景点，撰写真实的评价。',
        '我们制作涵盖韩餐、西餐、日餐、咖啡厅、国内外旅行等多种类别的内容。所有内容自动翻译成8种语言，触达海外读者。',
      ],
    },
    seoStrengths: {
      heading: '全球覆盖，技术SEO',
      subtext: '不仅仅是博客，更是为搜索引擎优化的技术驱动内容平台。',
      multilingual: {
        heading: '8种语言多语言支持',
        description: '韩语、英语、日语、中文（简体/繁体）、印尼语、越南语、泰语',
      },
      features: [
        {
          title: '静态站点生成（SSG）',
          description: '在构建时预生成所有页面，确保快速加载速度。',
        },
        {
          title: 'JSON-LD结构化数据',
          description:
            '包含BlogPosting、Review、BreadcrumbList等丰富的结构化数据，使搜索结果更加突出。',
        },
        {
          title: 'Hreflang标签',
          description: '正确地向搜索引擎传达8种语言页面之间的语言关系。',
        },
        {
          title: 'XML站点地图',
          description: '所有语言的所有页面都包含在站点地图中，提高索引效率。',
        },
      ],
    },
    stats: {
      heading: `数字看${SITE_NAME_EN}`,
      // TODO: 替换为实际GA4数据
      items: [
        { value: '10,000+', label: '月访问量' },
        { value: '8', label: '支持语言' },
        { value: '50+', label: '已发布评价' },
        { value: '3', label: '内容类别' },
      ],
    },
    collaboration: {
      heading: '合作方式',
      subtext: '可以进行多种形式的合作。',
      types: [
        {
          title: '赞助评价',
          description: '体验产品或服务，以8种语言发布真实评价。',
          icon: '📝',
        },
        {
          title: '体验访问',
          description: '亲自访问店铺或旅游景点，撰写生动的评价。',
          icon: '📍',
        },
        {
          title: '横幅广告',
          description: '在网站适当位置投放横幅广告。',
          icon: '📢',
        },
      ],
    },
    cta: {
      heading: '联系我们',
      subtext: '点击下方按钮发送邮件，我们会尽快回复您。',
      buttonLabel: '发送邮件咨询',
      mailto: {
        subject: `[${SITE_NAME_EN}] 赞助咨询`,
        body:
          `您好，想向${SITE_NAME_EN}团队咨询赞助事宜。\n\n` +
          '1. 公司名/品牌名:\n' +
          '2. 合作类型（赞助评价 / 体验访问 / 横幅广告 / 其他）:\n' +
          '3. 预算范围:\n' +
          '4. 期望日程:\n' +
          '5. 其他事项:\n',
      },
    },
  },
  'zh-TW': {
    meta: {
      title: '贊助諮詢',
      description: `${SITE_NAME_EN}是一個以8種語言提供美食、咖啡廳、旅行內容的情侶部落格。歡迎贊助和廣告諮詢。`,
    },
    hero: {
      headline: '尋找共同成長的\n合作夥伴',
      subtext: `${SITE_NAME_EN}是一個以8種語言向全世界傳遞韓國美食、咖啡廳、旅行內容的情侶部落格。`,
      cta: '贊助諮詢',
    },
    blogIntro: {
      heading: `關於${SITE_NAME_EN}`,
      paragraphs: [
        '我們是一對情侶部落客，親自走訪首爾及韓國各地的餐廳、咖啡廳和旅遊景點，撰寫真實的評價。',
        '我們製作涵蓋韓餐、西餐、日餐、咖啡廳、國內外旅行等多種類別的內容。所有內容自動翻譯成8種語言，觸達海外讀者。',
      ],
    },
    seoStrengths: {
      heading: '全球覆蓋，技術SEO',
      subtext: '不僅僅是部落格，更是為搜尋引擎優化的技術驅動內容平台。',
      multilingual: {
        heading: '8種語言多語言支援',
        description: '韓語、英語、日語、中文（簡體/繁體）、印尼語、越南語、泰語',
      },
      features: [
        {
          title: '靜態網站生成（SSG）',
          description: '在建構時預先生成所有頁面，確保快速載入速度。',
        },
        {
          title: 'JSON-LD結構化資料',
          description:
            '包含BlogPosting、Review、BreadcrumbList等豐富的結構化資料，使搜尋結果更加突出。',
        },
        {
          title: 'Hreflang標籤',
          description: '正確地向搜尋引擎傳達8種語言頁面之間的語言關係。',
        },
        {
          title: 'XML網站地圖',
          description: '所有語言的所有頁面都包含在網站地圖中，提高索引效率。',
        },
      ],
    },
    stats: {
      heading: `數字看${SITE_NAME_EN}`,
      // TODO: 替換為實際GA4數據
      items: [
        { value: '10,000+', label: '月訪問量' },
        { value: '8', label: '支援語言' },
        { value: '50+', label: '已發布評價' },
        { value: '3', label: '內容類別' },
      ],
    },
    collaboration: {
      heading: '合作方式',
      subtext: '可以進行多種形式的合作。',
      types: [
        {
          title: '贊助評價',
          description: '體驗產品或服務，以8種語言發布真實評價。',
          icon: '📝',
        },
        {
          title: '體驗訪問',
          description: '親自訪問店鋪或旅遊景點，撰寫生動的評價。',
          icon: '📍',
        },
        {
          title: '橫幅廣告',
          description: '在網站適當位置投放橫幅廣告。',
          icon: '📢',
        },
      ],
    },
    cta: {
      heading: '聯繫我們',
      subtext: '點擊下方按鈕發送郵件，我們會盡快回覆您。',
      buttonLabel: '發送郵件諮詢',
      mailto: {
        subject: `[${SITE_NAME_EN}] 贊助諮詢`,
        body:
          `您好，想向${SITE_NAME_EN}團隊諮詢贊助事宜。\n\n` +
          '1. 公司名/品牌名:\n' +
          '2. 合作類型（贊助評價 / 體驗訪問 / 橫幅廣告 / 其他）:\n' +
          '3. 預算範圍:\n' +
          '4. 期望日程:\n' +
          '5. 其他事項:\n',
      },
    },
  },
  id: {
    meta: {
      title: 'Kerja Sama Sponsor',
      description: `${SITE_NAME_EN} adalah blog pasangan yang menyediakan konten kuliner, kafe, dan wisata dalam 8 bahasa. Kami menerima pertanyaan sponsor dan iklan.`,
    },
    hero: {
      headline: 'Mencari Mitra\nuntuk Bertumbuh Bersama',
      subtext: `${SITE_NAME_EN} adalah blog pasangan yang menyampaikan konten kuliner, kafe, dan wisata Korea ke seluruh dunia dalam 8 bahasa.`,
      cta: 'Hubungi untuk Sponsor',
    },
    blogIntro: {
      heading: `Tentang ${SITE_NAME_EN}`,
      paragraphs: [
        'Kami adalah pasangan blogger yang secara langsung mengunjungi restoran, kafe, dan destinasi wisata di Seoul dan seluruh Korea, menulis ulasan yang jujur.',
        'Kami membuat konten dari berbagai kategori termasuk masakan Korea, Barat, Jepang, kafe, dan perjalanan domestik/internasional. Semua konten diterjemahkan secara otomatis ke 8 bahasa untuk menjangkau pembaca internasional.',
      ],
    },
    seoStrengths: {
      heading: 'Jangkauan Global, SEO Teknis',
      subtext:
        'Bukan sekadar blog, tapi platform konten berbasis teknologi yang dioptimalkan untuk mesin pencari.',
      multilingual: {
        heading: 'Dukungan 8 Bahasa',
        description:
          'Korea, Inggris, Jepang, Mandarin (Sederhana/Tradisional), Indonesia, Vietnam, Thai',
      },
      features: [
        {
          title: 'Static Site Generation (SSG)',
          description:
            'Semua halaman dibuat terlebih dahulu saat build, memastikan kecepatan loading yang cepat.',
        },
        {
          title: 'Data Terstruktur JSON-LD',
          description:
            'Data terstruktur yang kaya termasuk BlogPosting, Review, dan BreadcrumbList untuk hasil pencarian yang lebih menonjol.',
        },
        {
          title: 'Tag Hreflang',
          description:
            'Mengomunikasikan hubungan bahasa antar halaman dalam 8 bahasa dengan benar ke mesin pencari.',
        },
        {
          title: 'XML Sitemap',
          description:
            'Semua halaman dalam semua bahasa termasuk dalam sitemap untuk efisiensi pengindeksan.',
        },
      ],
    },
    stats: {
      heading: `${SITE_NAME_EN} dalam Angka`,
      // TODO: Ganti dengan data GA4 aktual
      items: [
        { value: '10.000+', label: 'Pengunjung Bulanan' },
        { value: '8', label: 'Bahasa' },
        { value: '50+', label: 'Ulasan Dipublikasi' },
        { value: '3', label: 'Kategori Konten' },
      ],
    },
    collaboration: {
      heading: 'Opsi Kolaborasi',
      subtext: 'Berbagai bentuk kolaborasi tersedia.',
      types: [
        {
          title: 'Ulasan Sponsor',
          description:
            'Pengalaman produk atau layanan Anda dan publikasikan ulasan jujur dalam 8 bahasa.',
          icon: '📝',
        },
        {
          title: 'Kunjungan Pengalaman',
          description:
            'Kunjungi tempat atau destinasi Anda secara langsung dan tulis ulasan yang hidup.',
          icon: '📍',
        },
        {
          title: 'Iklan Banner',
          description: 'Tempatkan iklan banner di posisi yang sesuai di situs kami.',
          icon: '📢',
        },
      ],
    },
    cta: {
      heading: 'Hubungi Kami',
      subtext:
        'Klik tombol di bawah untuk mengirim email dan kami akan segera membalas.',
      buttonLabel: 'Kirim Email',
      mailto: {
        subject: `[${SITE_NAME_EN}] Kerja Sama Sponsor`,
        body:
          `Halo, saya ingin bertanya tentang sponsorship dengan ${SITE_NAME_EN}.\n\n` +
          '1. Nama perusahaan/merek:\n' +
          '2. Jenis kolaborasi (Ulasan sponsor / Kunjungan pengalaman / Iklan banner / Lainnya):\n' +
          '3. Kisaran anggaran:\n' +
          '4. Jadwal yang diinginkan:\n' +
          '5. Catatan tambahan:\n',
      },
    },
  },
  vi: {
    meta: {
      title: 'Hợp Tác Tài Trợ',
      description: `${SITE_NAME_EN} là blog đôi cung cấp nội dung ẩm thực, quán cà phê và du lịch bằng 8 ngôn ngữ. Chúng tôi chào đón các yêu cầu tài trợ và quảng cáo.`,
    },
    hero: {
      headline: 'Tìm Kiếm Đối Tác\nCùng Phát Triển',
      subtext: `${SITE_NAME_EN} là blog đôi truyền tải nội dung ẩm thực, quán cà phê và du lịch Hàn Quốc đến thế giới bằng 8 ngôn ngữ.`,
      cta: 'Liên Hệ Tài Trợ',
    },
    blogIntro: {
      heading: `Giới Thiệu ${SITE_NAME_EN}`,
      paragraphs: [
        'Chúng tôi là cặp đôi blogger trực tiếp ghé thăm các nhà hàng, quán cà phê và điểm du lịch trên khắp Seoul và Hàn Quốc, viết những đánh giá chân thực.',
        'Chúng tôi tạo nội dung đa dạng từ ẩm thực Hàn, Tây, Nhật, quán cà phê đến du lịch trong và ngoài nước. Tất cả nội dung được tự động dịch sang 8 ngôn ngữ để tiếp cận độc giả quốc tế.',
      ],
    },
    seoStrengths: {
      heading: 'Phạm Vi Toàn Cầu, SEO Kỹ Thuật',
      subtext:
        'Không chỉ là blog, mà là nền tảng nội dung dựa trên công nghệ được tối ưu hóa cho công cụ tìm kiếm.',
      multilingual: {
        heading: 'Hỗ Trợ 8 Ngôn Ngữ',
        description:
          'Tiếng Hàn, Anh, Nhật, Trung (Giản thể/Phồn thể), Indonesia, Việt, Thái',
      },
      features: [
        {
          title: 'Tạo Trang Tĩnh (SSG)',
          description:
            'Tất cả trang được tạo sẵn khi build, đảm bảo tốc độ tải nhanh.',
        },
        {
          title: 'Dữ Liệu Cấu Trúc JSON-LD',
          description:
            'Dữ liệu cấu trúc phong phú bao gồm BlogPosting, Review và BreadcrumbList giúp nổi bật trong kết quả tìm kiếm.',
        },
        {
          title: 'Thẻ Hreflang',
          description:
            'Truyền đạt chính xác mối quan hệ ngôn ngữ giữa các trang trong 8 ngôn ngữ đến công cụ tìm kiếm.',
        },
        {
          title: 'XML Sitemap',
          description:
            'Tất cả trang trong tất cả ngôn ngữ đều có trong sitemap để tăng hiệu quả lập chỉ mục.',
        },
      ],
    },
    stats: {
      heading: `${SITE_NAME_EN} Qua Những Con Số`,
      // TODO: Thay thế bằng dữ liệu GA4 thực tế
      items: [
        { value: '10.000+', label: 'Lượt Truy Cập/Tháng' },
        { value: '8', label: 'Ngôn Ngữ' },
        { value: '50+', label: 'Bài Đánh Giá' },
        { value: '3', label: 'Danh Mục' },
      ],
    },
    collaboration: {
      heading: 'Hình Thức Hợp Tác',
      subtext: 'Nhiều hình thức hợp tác khác nhau có sẵn.',
      types: [
        {
          title: 'Đánh Giá Tài Trợ',
          description:
            'Trải nghiệm sản phẩm hoặc dịch vụ và đăng đánh giá chân thực bằng 8 ngôn ngữ.',
          icon: '📝',
        },
        {
          title: 'Ghé Thăm Trải Nghiệm',
          description:
            'Trực tiếp ghé thăm cửa hàng hoặc điểm du lịch và viết bài đánh giá sống động.',
          icon: '📍',
        },
        {
          title: 'Quảng Cáo Banner',
          description: 'Đặt quảng cáo banner tại vị trí phù hợp trên trang web.',
          icon: '📢',
        },
      ],
    },
    cta: {
      heading: 'Liên Hệ',
      subtext:
        'Nhấn nút bên dưới để gửi email, chúng tôi sẽ phản hồi nhanh chóng.',
      buttonLabel: 'Gửi Email Liên Hệ',
      mailto: {
        subject: `[${SITE_NAME_EN}] Hợp Tác Tài Trợ`,
        body:
          `Xin chào, tôi muốn hỏi về hợp tác tài trợ với ${SITE_NAME_EN}.\n\n` +
          '1. Tên công ty/thương hiệu:\n' +
          '2. Loại hợp tác (Đánh giá tài trợ / Ghé thăm trải nghiệm / Quảng cáo banner / Khác):\n' +
          '3. Phạm vi ngân sách:\n' +
          '4. Lịch trình mong muốn:\n' +
          '5. Ghi chú thêm:\n',
      },
    },
  },
  th: {
    meta: {
      title: 'สอบถามสปอนเซอร์',
      description: `${SITE_NAME_EN} เป็นบล็อกคู่รักที่นำเสนอเนื้อหาร้านอาหาร คาเฟ่ และท่องเที่ยวใน 8 ภาษา ยินดีรับสอบถามสปอนเซอร์และโฆษณา`,
    },
    hero: {
      headline: 'กำลังมองหาพาร์ทเนอร์\nเพื่อเติบโตไปด้วยกัน',
      subtext: `${SITE_NAME_EN} เป็นบล็อกคู่รักที่ส่งมอบเนื้อหาร้านอาหาร คาเฟ่ และท่องเที่ยวเกาหลีไปทั่วโลกใน 8 ภาษา`,
      cta: 'สอบถามสปอนเซอร์',
    },
    blogIntro: {
      heading: `เกี่ยวกับ ${SITE_NAME_EN}`,
      paragraphs: [
        'เราเป็นคู่รักบล็อกเกอร์ที่ไปเยือนร้านอาหาร คาเฟ่ และสถานที่ท่องเที่ยวทั่วโซลและเกาหลีด้วยตนเอง เขียนรีวิวอย่างจริงใจ',
        'เราสร้างเนื้อหาหลากหลายประเภท ทั้งอาหารเกาหลี ตะวันตก ญี่ปุ่น คาเฟ่ และการท่องเที่ยวในและต่างประเทศ เนื้อหาทั้งหมดแปลอัตโนมัติเป็น 8 ภาษาเพื่อเข้าถึงผู้อ่านต่างชาติ',
      ],
    },
    seoStrengths: {
      heading: 'เข้าถึงทั่วโลก, SEO เชิงเทคนิค',
      subtext:
        'ไม่ใช่แค่บล็อก แต่เป็นแพลตฟอร์มเนื้อหาที่ขับเคลื่อนด้วยเทคโนโลยีที่ปรับแต่งสำหรับเครื่องมือค้นหา',
      multilingual: {
        heading: 'รองรับ 8 ภาษา',
        description:
          'เกาหลี, อังกฤษ, ญี่ปุ่น, จีน (ตัวย่อ/ตัวเต็ม), อินโดนีเซีย, เวียดนาม, ไทย',
      },
      features: [
        {
          title: 'การสร้างเว็บไซต์แบบสถิต (SSG)',
          description:
            'สร้างทุกหน้าล่วงหน้าตอน build รับประกันความเร็วในการโหลด',
        },
        {
          title: 'ข้อมูลโครงสร้าง JSON-LD',
          description:
            'ข้อมูลโครงสร้างที่สมบูรณ์ รวมถึง BlogPosting, Review และ BreadcrumbList ทำให้โดดเด่นในผลการค้นหา',
        },
        {
          title: 'แท็ก Hreflang',
          description:
            'สื่อสารความสัมพันธ์ทางภาษาระหว่างหน้าใน 8 ภาษาอย่างถูกต้องไปยังเครื่องมือค้นหา',
        },
        {
          title: 'XML Sitemap',
          description:
            'ทุกหน้าในทุกภาษารวมอยู่ใน sitemap เพื่อเพิ่มประสิทธิภาพการจัดทำดัชนี',
        },
      ],
    },
    stats: {
      heading: `${SITE_NAME_EN} ในตัวเลข`,
      // TODO: แทนที่ด้วยข้อมูล GA4 จริง
      items: [
        { value: '10,000+', label: 'ผู้เยี่ยมชมรายเดือน' },
        { value: '8', label: 'ภาษา' },
        { value: '50+', label: 'รีวิวที่เผยแพร่' },
        { value: '3', label: 'หมวดหมู่เนื้อหา' },
      ],
    },
    collaboration: {
      heading: 'รูปแบบความร่วมมือ',
      subtext: 'มีรูปแบบความร่วมมือหลากหลายให้เลือก',
      types: [
        {
          title: 'รีวิวสปอนเซอร์',
          description:
            'ทดลองผลิตภัณฑ์หรือบริการและเผยแพร่รีวิวอย่างจริงใจใน 8 ภาษา',
          icon: '📝',
        },
        {
          title: 'เยี่ยมชมสถานที่',
          description:
            'ไปเยือนร้านค้าหรือสถานที่ท่องเที่ยวด้วยตนเองและเขียนรีวิวที่มีชีวิตชีวา',
          icon: '📍',
        },
        {
          title: 'โฆษณาแบนเนอร์',
          description: 'วางโฆษณาแบนเนอร์ในตำแหน่งที่เหมาะสมบนเว็บไซต์',
          icon: '📢',
        },
      ],
    },
    cta: {
      heading: 'ติดต่อเรา',
      subtext:
        'กดปุ่มด้านล่างเพื่อส่งอีเมล เราจะตอบกลับอย่างรวดเร็ว',
      buttonLabel: 'ส่งอีเมลสอบถาม',
      mailto: {
        subject: `[${SITE_NAME_EN}] สอบถามสปอนเซอร์`,
        body:
          `สวัสดีครับ/ค่ะ ต้องการสอบถามเรื่องสปอนเซอร์กับ ${SITE_NAME_EN}\n\n` +
          '1. ชื่อบริษัท/แบรนด์:\n' +
          '2. ประเภทความร่วมมือ (รีวิวสปอนเซอร์ / เยี่ยมชมสถานที่ / โฆษณาแบนเนอร์ / อื่นๆ):\n' +
          '3. ช่วงงบประมาณ:\n' +
          '4. กำหนดการที่ต้องการ:\n' +
          '5. หมายเหตุเพิ่มเติม:\n',
      },
    },
  },
};

export const getSponsorContent = (locale: Locale): SponsorContent =>
  SPONSOR[locale] ?? SPONSOR.ko;

export const buildMailtoHref = (content: SponsorContent): string => {
  const { mailto } = content.cta;
  const subject = encodeURIComponent(mailto.subject);
  const body = encodeURIComponent(mailto.body);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
};
