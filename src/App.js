import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Menu, X, Calendar, User, Globe, Search, ExternalLink } from 'lucide-react';

const VoiceNewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('general');
  const [source, setSource] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [command, setCommand] = useState('');
  
  const speechSynthesis = useRef(window.speechSynthesis);
  const recognition = useRef(null);
  const articlesRef = useRef(null);

  const categories = [
    'general', 'business', 'entertainment', 'health', 
    'science', 'sports', 'technology'
  ];

  const sources = [
    'bbc-news', 'cnn', 'reuters', 'associated-press',
    'the-guardian-uk', 'the-new-york-times', 'techcrunch'
  ];

  // NewsAPI configuration
  const NEWS_API_KEY = 'pub_5c5ceab689d64fb899db192a20af083c'; // Replace with your NewsAPI key
const NEWS_API_BASE_URL = 'https://newsdata.io/api/1/news';

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => {
        setIsListening(true);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        setCommand(transcript);
        processVoiceCommand(transcript);
      };
    }

    // Load initial news
    fetchNews();
  }, []);

  const fetchNews = async (term = '', cat = 'general', src = '') => {
    setLoading(true);
    try {
      let url = '';
      
      // Build API URL based on search criteria
      if (term) {
        url = `${NEWS_API_BASE_URL}/?q=${encodeURIComponent(term)}&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`;
      } else if (src) {
        url = `${NEWS_API_BASE_URL}/top-headlines?sources=${src}&apiKey=${NEWS_API_KEY}`;
      } else {
        url = `${NEWS_API_BASE_URL}/top-headlines?category=${cat}&country=us&pageSize=20&apiKey=${NEWS_API_KEY}`;
      }

      // For demo purposes, we'll use a mock API that simulates real data
      // In production, uncomment the real API call below
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Mock response with more diverse content
      const mockData = await getMockNewsData(term, cat, src);
      
      if (mockData.articles) {
        setArticles(mockData.articles);
        setCurrentArticle(0);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };
  

  const getMockNewsData = async (term = '', cat = 'general', src = '') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockArticles = {
      general: [
        {
          title: "Global Markets Show Strong Recovery Amid Economic Optimism",
          description: "Stock markets worldwide have shown remarkable resilience as investors show renewed confidence in economic recovery plans.",
          url: "https://example.com/markets-recovery",
          urlToImage: "https://via.placeholder.com/400x200/059669/FFFFFF?text=Market+Recovery",
          publishedAt: "2025-06-09T14:30:00Z",
          source: { name: "Financial Times" }
        },
        {
          title: "International Climate Summit Reaches Historic Agreement",
          description: "World leaders have reached a groundbreaking consensus on climate action, setting ambitious targets for carbon neutrality.",
          url: "https://example.com/climate-agreement",
          urlToImage: "https://via.placeholder.com/400x200/0EA5E9/FFFFFF?text=Climate+Summit",
          publishedAt: "2025-06-09T13:15:00Z",
          source: { name: "Reuters" }
        }
      ],
      business: [
        {
          title: "Tech Giants Report Record Quarterly Earnings",
          description: "Major technology companies have exceeded expectations with strong quarterly results driven by AI and cloud computing growth.",
          url: "https://example.com/tech-earnings",
          urlToImage: "https://via.placeholder.com/400x200/7C3AED/FFFFFF?text=Tech+Earnings",
          publishedAt: "2025-06-09T12:45:00Z",
          source: { name: "Bloomberg" }
        },
        {
          title: "Startup Funding Reaches New Heights in Q2 2025",
          description: "Venture capital investments have surged to unprecedented levels, with AI and biotech startups leading the charge.",
          url: "https://example.com/startup-funding",
          urlToImage: "https://via.placeholder.com/400x200/DC2626/FFFFFF?text=Startup+Funding",
          publishedAt: "2025-06-09T11:20:00Z",
          source: { name: "TechCrunch" }
        },
        {
          title: "Major Retail Chain Announces Nationwide Expansion",
          description: "A leading retail company plans to open 200 new stores across the country, creating thousands of jobs.",
          url: "https://example.com/retail-expansion",
          urlToImage: "https://via.placeholder.com/400x200/059669/FFFFFF?text=Retail+Growth",
          publishedAt: "2025-06-09T10:30:00Z",
          source: { name: "Wall Street Journal" }
        }
      ],
      entertainment: [
        {
          title: "Hollywood Summer Blockbuster Breaks Opening Weekend Records",
          description: "The highly anticipated superhero sequel has shattered box office records, earning over $200 million worldwide in its opening weekend.",
          url: "https://example.com/blockbuster-record",
          urlToImage: "https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=Box+Office",
          publishedAt: "2025-06-09T16:00:00Z",
          source: { name: "Variety" }
        },
        {
          title: "Streaming Wars Heat Up with New Platform Launch",
          description: "A major entertainment company launches its new streaming service with exclusive original content and competitive pricing.",
          url: "https://example.com/streaming-launch",
          urlToImage: "https://via.placeholder.com/400x200/EC4899/FFFFFF?text=Streaming+Wars",
          publishedAt: "2025-06-09T14:45:00Z",
          source: { name: "The Hollywood Reporter" }
        },
        {
          title: "Music Festival Season Kicks Off with Star-Studded Lineup",
          description: "Summer music festivals are back in full swing with major artists and record-breaking attendance numbers.",
          url: "https://example.com/music-festival",
          urlToImage: "https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=Music+Festival",
          publishedAt: "2025-06-09T13:30:00Z",
          source: { name: "Rolling Stone" }
        }
      ],
      technology: [
        {
          title: "Revolutionary AI Chip Promises 10x Performance Boost",
          description: "A breakthrough in semiconductor technology could revolutionize artificial intelligence processing capabilities.",
          url: "https://example.com/ai-chip",
          urlToImage: "https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=AI+Chip",
          publishedAt: "2025-06-09T15:30:00Z",
          source: { name: "IEEE Spectrum" }
        },
        {
          title: "Quantum Computing Milestone Achieved by Research Team",
          description: "Scientists have successfully demonstrated quantum advantage in a practical computing application for the first time.",
          url: "https://example.com/quantum-computing",
          urlToImage: "https://via.placeholder.com/400x200/10B981/FFFFFF?text=Quantum+Computing",
          publishedAt: "2025-06-09T14:15:00Z",
          source: { name: "Nature Technology" }
        }
      ],
      sports: [
        {
          title: "Championship Finals Set Record Viewership Numbers",
          description: "The season finale has attracted the largest television audience in the sport's history, with millions tuning in worldwide.",
          url: "https://example.com/championship-finals",
          urlToImage: "https://via.placeholder.com/400x200/EF4444/FFFFFF?text=Championship",
          publishedAt: "2025-06-09T18:00:00Z",
          source: { name: "ESPN" }
        },
        {
          title: "Olympic Preparations Enter Final Phase",
          description: "Athletes and organizers are making final preparations for the upcoming Olympic Games with new safety protocols in place.",
          url: "https://example.com/olympic-prep",
          urlToImage: "https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=Olympics",
          publishedAt: "2025-06-09T16:45:00Z",
          source: { name: "Olympic News" }
        }
      ],
      health: [
        {
          title: "Breakthrough Cancer Treatment Shows Promising Results",
          description: "A new immunotherapy treatment has shown remarkable success rates in clinical trials for multiple cancer types.",
          url: "https://example.com/cancer-treatment",
          urlToImage: "https://via.placeholder.com/400x200/059669/FFFFFF?text=Medical+Breakthrough",
          publishedAt: "2025-06-09T12:00:00Z",
          source: { name: "Medical Journal" }
        },
        {
          title: "Mental Health Awareness Campaign Launches Globally",
          description: "A comprehensive mental health initiative aims to reduce stigma and improve access to mental healthcare worldwide.",
          url: "https://example.com/mental-health",
          urlToImage: "https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=Mental+Health",
          publishedAt: "2025-06-09T11:30:00Z",
          source: { name: "Health Today" }
        }
      ],
      science: [
        {
          title: "Mars Mission Discovers Evidence of Ancient Water Systems",
          description: "Latest findings from the Mars rover mission reveal extensive evidence of ancient river systems and possible past life.",
          url: "https://example.com/mars-discovery",
          urlToImage: "https://via.placeholder.com/400x200/DC2626/FFFFFF?text=Mars+Discovery",
          publishedAt: "2025-06-09T17:30:00Z",
          source: { name: "NASA News" }
        },
        {
          title: "Climate Change Research Reveals Accelerating Ice Loss",
          description: "New satellite data shows polar ice loss is accelerating faster than previously predicted, raising sea level concerns.",
          url: "https://example.com/climate-research",
          urlToImage: "https://via.placeholder.com/400x200/0EA5E9/FFFFFF?text=Climate+Research",
          publishedAt: "2025-06-09T15:00:00Z",
          source: { name: "Science Daily" }
        }
      ]
    };

    // Filter articles based on search term
    if (term) {
      const allArticles = Object.values(mockArticles).flat();
      const filteredArticles = allArticles.filter(article => 
        article.title.toLowerCase().includes(term.toLowerCase()) ||
        article.description.toLowerCase().includes(term.toLowerCase())
      );
      return { articles: filteredArticles };
    }

    // Return articles for specific category
    return { articles: mockArticles[cat] || mockArticles.general };
  };

  const processVoiceCommand = (transcript) => {
    console.log('Voice command:', transcript);
    
    if (transcript.includes('search for') || transcript.includes('find news about')) {
      const searchQuery = transcript.replace(/search for|find news about/g, '').trim();
      setSearchTerm(searchQuery);
      fetchNews(searchQuery, category, source);
      speak(`Searching for news about ${searchQuery}`);
    } else if (transcript.includes('read this article') || transcript.includes('read current article')) {
      readCurrentArticle();
    } else if (transcript.includes('next article')) {
      nextArticle();
    } else if (transcript.includes('previous article')) {
      previousArticle();
    } else if (transcript.includes('open article') || transcript.includes('open link')) {
      openCurrentArticle();
    } else if (transcript.includes('stop reading')) {
      stopSpeaking();
    } else if (transcript.includes('latest news')) {
      setSearchTerm('');
      setCategory('general');
      fetchNews();
      speak('Loading latest news');
    } else if (categories.some(cat => transcript.includes(cat))) {
      const foundCategory = categories.find(cat => transcript.includes(cat));
      setCategory(foundCategory);
      fetchNews(searchTerm, foundCategory, source);
      speak(`Loading ${foundCategory} news`);
    }
  };

  const speak = (text) => {
    if (speechSynthesis.current && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const readCurrentArticle = () => {
    if (articles[currentArticle]) {
      const article = articles[currentArticle];
      const textToRead = `${article.title}. ${article.description}`;
      speak(textToRead);
    }
  };

  const nextArticle = () => {
    if (currentArticle < articles.length - 1) {
      const newIndex = currentArticle + 1;
      setCurrentArticle(newIndex);
      scrollToArticle(newIndex);
      speak(`Article ${newIndex + 1} of ${articles.length}`);
    } else {
      speak('This is the last article');
    }
  };

  const previousArticle = () => {
    if (currentArticle > 0) {
      const newIndex = currentArticle - 1;
      setCurrentArticle(newIndex);
      scrollToArticle(newIndex);
      speak(`Article ${newIndex + 1} of ${articles.length}`);
    } else {
      speak('This is the first article');
    }
  };

  const openCurrentArticle = () => {
    if (articles[currentArticle]) {
      window.open(articles[currentArticle].url, '_blank');
      speak('Opening article in new tab');
    }
  };

  const scrollToArticle = (index) => {
    const articleElement = document.getElementById(`article-${index}`);
    if (articleElement) {
      articleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
    } else {
      recognition.current?.start();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Voice News AI
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={stopSpeaking}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isSpeaking 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                title={isSpeaking ? 'Stop Speaking' : 'Not Speaking'}
              >
                {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              <button
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                title={isListening ? 'Stop Listening' : 'Start Voice Control'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-30 w-80 bg-black/30 backdrop-blur-md border-r border-white/10 transition-transform duration-300 lg:block`}>
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Search className="mr-2" size={18} />
                Search News
              </h3>
              <input
                type="text"
                placeholder="Search by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchNews(searchTerm, category, source)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      fetchNews(searchTerm, cat, source);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors capitalize ${
                      category === cat 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Voice Commands</h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p>• "Search for [topic]"</p>
                <p>• "Read this article"</p>
                <p>• "Next article"</p>
                <p>• "Previous article"</p>
                <p>• "Open article"</p>
                <p>• "Latest news"</p>
                <p>• "[category] news" (e.g., "business news")</p>
                <p>• "Stop reading"</p>
              </div>
            </div>

            <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold mb-2">🔧 Setup Instructions:</h4>
              <div className="text-sm text-blue-200 space-y-1">
                <p>1. Get free API key from <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-100">NewsAPI.org</a></p>
                <p>2. Replace 'YOUR_API_KEY_HERE' in code</p>
                <p>3. Currently showing demo data</p>
              </div>
            </div>

            {command && (
              <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-300">Last command:</p>
                <p className="font-medium">"{command}"</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="space-y-6" ref={articlesRef}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {searchTerm ? `Search: "${searchTerm}"` : `${category.charAt(0).toUpperCase() + category.slice(1)} News`}
                </h2>
                <p className="text-gray-300">
                  {articles.length} articles found
                </p>
              </div>

              {articles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No articles found. Try a different search term or category.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {articles.map((article, index) => (
                    <article
                      key={index}
                      id={`article-${index}`}
                      className={`group rounded-xl overflow-hidden transition-all duration-300 ${
                        currentArticle === index 
                          ? 'ring-2 ring-blue-400 bg-white/10' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={article.urlToImage || 'https://via.placeholder.com/400x200/1F2937/9CA3AF?text=No+Image'}
                            alt={article.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <span className="flex items-center">
                              <User size={14} className="mr-1" />
                              {article.source.name}
                            </span>
                            <span className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(article.publishedAt)}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-300 mb-4 leading-relaxed">
                            {article.description}
                          </p>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setCurrentArticle(index);
                                readCurrentArticle();
                              }}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center"
                            >
                              <Volume2 size={16} className="mr-2" />
                              Read Article
                            </button>
                            
                            <button
                              onClick={() => window.open(article.url, '_blank')}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
                            >
                              <ExternalLink size={16} className="mr-2" />
                              Open Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Status Bar */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {isListening && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
            🎤 Listening...
          </div>
        )}
        {isSpeaking && (
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
            🔊 Speaking...
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceNewsApp;
