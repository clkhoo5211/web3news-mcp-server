/**
 * Comprehensive News Sources Configuration
 * RSS feeds from Google News, Bing News, Yahoo News, Baidu News, and major publishers
 * Organized by category for easy access
 */

export interface NewsSource {
  name: string;
  url: string;
  category: string;
  language: string;
  verified: boolean;
}

export const NEWS_SOURCES: NewsSource[] = [
  // ========== GENERAL NEWS ==========
  {
    name: 'Google News - Top Stories',
    url: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
    category: 'general',
    language: 'en',
    verified: true,
  },
  {
    name: 'Google News - World',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'general',
    language: 'en',
    verified: true,
  },
  {
    name: 'Yahoo News - Top Stories',
    url: 'https://news.yahoo.com/rss/',
    category: 'general',
    language: 'en',
    verified: true,
  },
  {
    name: 'Yahoo News - World',
    url: 'https://news.yahoo.com/rss/world',
    category: 'general',
    language: 'en',
    verified: true,
  },
  {
    name: 'Baidu News - 热点',
    url: 'https://news.baidu.com/rss/',
    category: 'general',
    language: 'zh',
    verified: true,
  },
  {
    name: 'BBC News - Top Stories',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    category: 'general',
    language: 'en',
    verified: true,
  },
  {
    name: 'CNN - Top Stories',
    url: 'http://rss.cnn.com/rss/cnn_topstories.rss',
    category: 'general',
    language: 'en',
    verified: true,
  },
  {
    name: 'Reuters - World News',
    url: 'http://feeds.reuters.com/Reuters/worldNews',
    category: 'general',
    language: 'en',
    verified: true,
  },
  {
    name: 'The Guardian - World',
    url: 'https://www.theguardian.com/world/rss',
    category: 'general',
    language: 'en',
    verified: true,
  },
  {
    name: 'Al Jazeera - All News',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'general',
    language: 'en',
    verified: true,
  },

  // ========== TECHNOLOGY ==========
  {
    name: 'Google News - Technology',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'tech',
    language: 'en',
    verified: true,
  },
  {
    name: 'Yahoo Tech',
    url: 'https://news.yahoo.com/rss/tech',
    category: 'tech',
    language: 'en',
    verified: true,
  },
  {
    name: 'TechCrunch',
    url: 'http://feeds.feedburner.com/TechCrunch/',
    category: 'tech',
    language: 'en',
    verified: true,
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    category: 'tech',
    language: 'en',
    verified: true,
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
    language: 'en',
    verified: true,
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'tech',
    language: 'en',
    verified: true,
  },
  {
    name: 'Engadget',
    url: 'https://www.engadget.com/rss.xml',
    category: 'tech',
    language: 'en',
    verified: true,
  },
  {
    name: 'CNET',
    url: 'https://www.cnet.com/rss/news/',
    category: 'tech',
    language: 'en',
    verified: true,
  },
  {
    name: 'Mashable',
    url: 'http://feeds.mashable.com/Mashable',
    category: 'tech',
    language: 'en',
    verified: true,
  },
  {
    name: 'Baidu Tech - 科技',
    url: 'https://news.baidu.com/rss/tech',
    category: 'tech',
    language: 'zh',
    verified: true,
  },

  // ========== BUSINESS ==========
  {
    name: 'Google News - Business',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'business',
    language: 'en',
    verified: true,
  },
  {
    name: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/news/rss/',
    category: 'business',
    language: 'en',
    verified: true,
  },
  {
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com/feed/podcast/etf-report.xml',
    category: 'business',
    language: 'en',
    verified: true,
  },
  {
    name: 'Financial Times',
    url: 'https://www.ft.com/rss/home/us',
    category: 'business',
    language: 'en',
    verified: true,
  },
  {
    name: 'Forbes',
    url: 'https://www.forbes.com/real-time/feed2/',
    category: 'business',
    language: 'en',
    verified: true,
  },
  {
    name: 'CNBC',
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    category: 'business',
    language: 'en',
    verified: true,
  },
  {
    name: 'MarketWatch',
    url: 'http://feeds.marketwatch.com/marketwatch/topstories/',
    category: 'business',
    language: 'en',
    verified: true,
  },
  {
    name: 'The Wall Street Journal',
    url: 'http://online.wsj.com/xml/rss/3_7085.xml',
    category: 'business',
    language: 'en',
    verified: true,
  },
  {
    name: 'Baidu Finance - 财经',
    url: 'https://news.baidu.com/rss/finance',
    category: 'business',
    language: 'zh',
    verified: true,
  },

  // ========== CRYPTO ==========
  {
    name: 'Google News - Cryptocurrency',
    url: 'https://news.google.com/rss/search?q=cryptocurrency&hl=en-US&gl=US&ceid=US:en',
    category: 'crypto',
    language: 'en',
    verified: true,
  },
  {
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'crypto',
    language: 'en',
    verified: true,
  },
  {
    name: 'CoinTelegraph',
    url: 'https://cointelegraph.com/rss',
    category: 'crypto',
    language: 'en',
    verified: true,
  },
  {
    name: 'Decrypt',
    url: 'https://decrypt.co/feed',
    category: 'crypto',
    language: 'en',
    verified: true,
  },
  {
    name: 'Bitcoin Magazine',
    url: 'https://bitcoinmagazine.com/.rss/full/',
    category: 'crypto',
    language: 'en',
    verified: true,
  },
  {
    name: 'The Block',
    url: 'https://www.theblock.co/rss.xml',
    category: 'crypto',
    language: 'en',
    verified: true,
  },

  // ========== SCIENCE ==========
  {
    name: 'Google News - Science',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'science',
    language: 'en',
    verified: true,
  },
  {
    name: 'Yahoo Science',
    url: 'https://news.yahoo.com/rss/science',
    category: 'science',
    language: 'en',
    verified: true,
  },
  {
    name: 'ScienceDaily',
    url: 'https://www.sciencedaily.com/rss/all.xml',
    category: 'science',
    language: 'en',
    verified: true,
  },
  {
    name: 'Nature',
    url: 'https://www.nature.com/subjects/rss.xml',
    category: 'science',
    language: 'en',
    verified: true,
  },
  {
    name: 'Scientific American',
    url: 'https://www.scientificamerican.com/feed/',
    category: 'science',
    language: 'en',
    verified: true,
  },
  {
    name: 'New Scientist',
    url: 'https://www.newscientist.com/feed/home',
    category: 'science',
    language: 'en',
    verified: true,
  },
  {
    name: 'NASA Breaking News',
    url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    category: 'science',
    language: 'en',
    verified: true,
  },

  // ========== HEALTH ==========
  {
    name: 'Google News - Health',
    url: 'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRGU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US:en',
    category: 'health',
    language: 'en',
    verified: true,
  },
  {
    name: 'Yahoo Health',
    url: 'https://news.yahoo.com/rss/health',
    category: 'health',
    language: 'en',
    verified: true,
  },
  {
    name: 'WebMD',
    url: 'https://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC',
    category: 'health',
    language: 'en',
    verified: true,
  },
  {
    name: 'Medical News Today',
    url: 'https://www.medicalnewstoday.com/rss',
    category: 'health',
    language: 'en',
    verified: true,
  },
  {
    name: 'Healthline',
    url: 'https://www.healthline.com/rss',
    category: 'health',
    language: 'en',
    verified: true,
  },
  {
    name: 'Mayo Clinic',
    url: 'https://newsnetwork.mayoclinic.org/feed/',
    category: 'health',
    language: 'en',
    verified: true,
  },
  {
    name: 'NPR Health',
    url: 'https://www.npr.org/rss/rss.php?id=1128',
    category: 'health',
    language: 'en',
    verified: true,
  },

  // ========== SPORTS ==========
  {
    name: 'Google News - Sports',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'sports',
    language: 'en',
    verified: true,
  },
  {
    name: 'Yahoo Sports',
    url: 'https://sports.yahoo.com/rss/',
    category: 'sports',
    language: 'en',
    verified: true,
  },
  {
    name: 'ESPN',
    url: 'http://www.espn.com/espn/rss/news',
    category: 'sports',
    language: 'en',
    verified: true,
  },
  {
    name: 'BBC Sport',
    url: 'http://feeds.bbci.co.uk/sport/rss.xml',
    category: 'sports',
    language: 'en',
    verified: true,
  },
  {
    name: 'CBS Sports',
    url: 'https://www.cbssports.com/rss/headlines/',
    category: 'sports',
    language: 'en',
    verified: true,
  },
  {
    name: 'Sports Illustrated',
    url: 'https://www.si.com/rss/si_topstories.rss',
    category: 'sports',
    language: 'en',
    verified: true,
  },
  {
    name: 'Baidu Sports - 体育',
    url: 'https://news.baidu.com/rss/sports',
    category: 'sports',
    language: 'zh',
    verified: true,
  },

  // ========== ENTERTAINMENT ==========
  {
    name: 'Google News - Entertainment',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'entertainment',
    language: 'en',
    verified: true,
  },
  {
    name: 'Yahoo Entertainment',
    url: 'https://news.yahoo.com/rss/entertainment',
    category: 'entertainment',
    language: 'en',
    verified: true,
  },
  {
    name: 'E! Online',
    url: 'http://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml',
    category: 'entertainment',
    language: 'en',
    verified: true,
  },
  {
    name: 'Variety',
    url: 'https://variety.com/feed/',
    category: 'entertainment',
    language: 'en',
    verified: true,
  },
  {
    name: 'Rolling Stone',
    url: 'https://www.rollingstone.com/feed/',
    category: 'entertainment',
    language: 'en',
    verified: true,
  },
  {
    name: 'TMZ',
    url: 'https://www.tmz.com/rss.xml',
    category: 'entertainment',
    language: 'en',
    verified: true,
  },
  {
    name: 'People',
    url: 'https://people.com/feed/',
    category: 'entertainment',
    language: 'en',
    verified: true,
  },

  // ========== POLITICS ==========
  {
    name: 'Google News - Politics',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'politics',
    language: 'en',
    verified: true,
  },
  {
    name: 'Yahoo Politics',
    url: 'https://news.yahoo.com/rss/politics',
    category: 'politics',
    language: 'en',
    verified: true,
  },
  {
    name: 'Politico',
    url: 'http://www.politico.com/rss/politicopicks.xml',
    category: 'politics',
    language: 'en',
    verified: true,
  },
  {
    name: 'The Hill',
    url: 'http://thehill.com/rss/syndicator/19110',
    category: 'politics',
    language: 'en',
    verified: true,
  },
  {
    name: 'BBC Politics',
    url: 'https://feeds.bbci.co.uk/news/politics/rss.xml',
    category: 'politics',
    language: 'en',
    verified: true,
  },
  {
    name: 'NPR Politics',
    url: 'https://feeds.npr.org/1014/rss.xml',
    category: 'politics',
    language: 'en',
    verified: true,
  },
  {
    name: 'Reuters Politics',
    url: 'https://www.reuters.com/politics/rss',
    category: 'politics',
    language: 'en',
    verified: true,
  },

  // ========== ENVIRONMENT ==========
  {
    name: 'Google News - Environment',
    url: 'https://news.google.com/rss/search?q=environment+climate&hl=en-US&gl=US&ceid=US:en',
    category: 'environment',
    language: 'en',
    verified: true,
  },
  {
    name: 'BBC Environment',
    url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    category: 'environment',
    language: 'en',
    verified: true,
  },
  {
    name: 'Reuters Environment',
    url: 'https://www.reuters.com/environment/rss',
    category: 'environment',
    language: 'en',
    verified: true,
  },
  {
    name: 'The Guardian Environment',
    url: 'https://www.theguardian.com/environment/rss',
    category: 'environment',
    language: 'en',
    verified: true,
  },
  {
    name: 'Climate Change News',
    url: 'https://www.climatechangenews.com/feed/',
    category: 'environment',
    language: 'en',
    verified: true,
  },
  {
    name: 'Inside Climate News',
    url: 'https://insideclimatenews.org/feed/',
    category: 'environment',
    language: 'en',
    verified: true,
  },

  // ========== CHINESE SOURCES (中文) ==========
  {
    name: 'Bilibili - 热门视频 (RSSHub)',
    url: 'https://rsshub.app/bilibili/popular/all',
    category: 'entertainment',
    language: 'zh',
    verified: true,
  },
  {
    name: 'Bilibili - 科技区 (RSSHub)',
    url: 'https://rsshub.app/bilibili/partion/36',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: 'Bilibili - 游戏区 (RSSHub)',
    url: 'https://rsshub.app/bilibili/partion/4',
    category: 'entertainment',
    language: 'zh',
    verified: true,
  },
  {
    name: 'Weibo - 热搜榜 (RSSHub)',
    url: 'https://rsshub.app/weibo/search/hot',
    category: 'social',
    language: 'zh',
    verified: true,
  },
  {
    name: '人民网 - 时政',
    url: 'http://www.people.com.cn/rss/politics.xml',
    category: 'politics',
    language: 'zh',
    verified: true,
  },
  {
    name: '人民网 - 科技',
    url: 'http://www.people.com.cn/rss/it.xml',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: '中新网 - 国内新闻',
    url: 'http://www.chinanews.com/rss/gn.xml',
    category: 'general',
    language: 'zh',
    verified: true,
  },
  {
    name: '中新网 - 国际新闻',
    url: 'http://www.chinanews.com/rss/gj.xml',
    category: 'general',
    language: 'zh',
    verified: true,
  },
  {
    name: '新京报',
    url: 'http://www.bjnews.com.cn/feed',
    category: 'general',
    language: 'zh',
    verified: true,
  },
  {
    name: '知乎 - 每日精选',
    url: 'https://www.zhihu.com/rss',
    category: 'social',
    language: 'zh',
    verified: true,
  },
  {
    name: '少数派',
    url: 'https://sspai.com/feed',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: '极客公园',
    url: 'http://www.geekpark.net/rss',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: '爱范儿',
    url: 'https://www.ifanr.com/feed',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: 'cnBeta',
    url: 'http://www.cnbeta.com/backend.php',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: '什么值得买',
    url: 'http://feed.smzdm.com',
    category: 'business',
    language: 'zh',
    verified: true,
  },
  {
    name: '好奇心日报',
    url: 'http://www.qdaily.com/feed.xml',
    category: 'general',
    language: 'zh',
    verified: true,
  },
  {
    name: '36氪',
    url: 'https://36kr.com/feed',
    category: 'business',
    language: 'zh',
    verified: true,
  },
  {
    name: '虎嗅网',
    url: 'https://www.huxiu.com/rss/0.xml',
    category: 'business',
    language: 'zh',
    verified: true,
  },
  {
    name: '澎湃新闻',
    url: 'https://www.thepaper.cn/rss',
    category: 'general',
    language: 'zh',
    verified: true,
  },
  {
    name: '界面新闻',
    url: 'https://www.jiemian.com/rss',
    category: 'business',
    language: 'zh',
    verified: true,
  },
  {
    name: '观察者网',
    url: 'https://www.guancha.cn/rss',
    category: 'politics',
    language: 'zh',
    verified: true,
  },
  {
    name: '财新网',
    url: 'https://www.caixin.com/rss',
    category: 'business',
    language: 'zh',
    verified: true,
  },
  {
    name: '第一财经',
    url: 'https://www.yicai.com/rss',
    category: 'business',
    language: 'zh',
    verified: true,
  },
  {
    name: '钛媒体',
    url: 'https://www.tmtpost.com/rss',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: 'DoNews',
    url: 'https://www.donews.com/rss',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: '雷锋网',
    url: 'https://www.leiphone.com/rss',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: '快科技',
    url: 'https://www.mydrivers.com/rss',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: '游研社',
    url: 'http://www.yystv.cn/rss/feed',
    category: 'entertainment',
    language: 'zh',
    verified: true,
  },
  {
    name: '机核',
    url: 'https://www.gcores.com/rss',
    category: 'entertainment',
    language: 'zh',
    verified: true,
  },
  {
    name: '游戏葡萄',
    url: 'http://youxiputao.com/feed',
    category: 'entertainment',
    language: 'zh',
    verified: true,
  },
  {
    name: '阮一峰的网络日志',
    url: 'http://www.ruanyifeng.com/blog/atom.xml',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: '小众软件',
    url: 'http://feed.appinn.com/',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
  {
    name: '异次元软件世界',
    url: 'http://feed.iplaysoft.com/',
    category: 'tech',
    language: 'zh',
    verified: true,
  },
];

/**
 * Get sources by category
 */
export function getSourcesByCategory(category: string): NewsSource[] {
  return NEWS_SOURCES.filter(source => source.category === category);
}

/**
 * Get sources by language
 */
export function getSourcesByLanguage(language: string): NewsSource[] {
  return NEWS_SOURCES.filter(source => source.language === language);
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(NEWS_SOURCES.map(source => source.category)));
}

/**
 * Get source by name
 */
export function getSourceByName(name: string): NewsSource | undefined {
  return NEWS_SOURCES.find(source => source.name === name);
}

