import { FaTerminal } from 'react-icons/fa';

type ProjectCategory = {
  title: string;
  period: string;
  projects: {
    name: string;
    description: string;
  }[];
};

export default function Projects() {
  const projectCategories: ProjectCategory[] = [
    {
      title: 'Blockchain Initiatives',
      period: '2016 — 2021',
      projects: [
        {
          name: 'Multi-Chain Mining Pool Platform',
          description: 'Engineered a cross-chain mining pool system supporting EOS, ETH, and BTC with TypeScript backend and Vue.js frontend deployed on Kubernetes. Implemented blockchain-specific smart contracts for transparent profit sharing and automated payouts.'
        },
        {
          name: 'Decentralized Exchange (DEX)',
          description: 'Designed a hybrid Bancor-Orderbook model for cross-chain asset trading with TypeScript microservices orchestrated with Kubernetes. Implemented atomic swaps and cross-chain liquidity pools with automated market making algorithms.'
        },
        {
          name: 'Blockchain App Center',
          description: 'Built a platform enabling streamlined deployment of applications across multiple blockchains. Pioneered the industry&apos;s first real-time profit-sharing system for developers, eliminating the typical one-week delay in earnings distribution.'
        }
      ]
    },
    {
      title: 'AI Research & Trading Automation',
      period: '2023 — Present',
      projects: [
        {
          name: 'AI Automation',
          description: 'Engineered AI automation with Python, Node.js, OpenAI, and LangChain, training PPO/A2C models and AlphaGo algorithms, boosting efficiency by 40% in stock analysis tools.'
        },
        {
          name: 'Stock Trading Tool',
          description: 'Developed a Go-based stock trading tool with TradingView integration, using reinforcement learning to optimize trades, achieving 30% higher returns in simulations.'
        },
        {
          name: 'LLM-powered Customer Service',
          description: 'Built store review and CS email reply systems with LLMs, reducing response time by 50%.'
        }
      ]
    },
    {
      title: 'Personal Projects',
      period: '2015 — 2024',
      projects: [
        {
          name: 'Anymud (2023-2024)',
          description: 'Built a Medium-like platform with TypeScript, Vue.js, and Nest.js, featuring an advanced HTML editable element editor (copy/paste images, backspace), slashing content creation time by 50%. Deployed on GCP with Docker, optimizing SEO and structured data for search engine visibility, driving 60% organic traffic growth.'
        },
        {
          name: 'NovelFeed (2015-2018)',
          description: 'Developed a publisher-focused article sharing platform with PHP and MySQL, including Facebook and mobile versions, growing engagement by 45%. Optimized webapp with semantic HTML, SEO, and structured data, achieving top search engine rankings for publisher content.'
        },
        {
          name: 'SotiMediaOrganizer (2024)',
          description: 'Created a media deduplication tool with TypeScript, Python, and Bun, leveraging Simhash, VP Tree, and FFmpeg to process audio/video 60% faster (github.com/shtse8/SotiMediaOrganizer).'
        }
      ]
    },
    {
      title: 'Open Source Contributions',
      period: 'Various',
      projects: [
        {
          name: 'xserver',
          description: 'Dart-based web server with automated endpoint registration.'
        },
        {
          name: 'xdash',
          description: 'Modular TypeScript utility library with strong typing.'
        },
        {
          name: 'dart_firebase_admin',
          description: 'Dart SDK for Firebase administration.'
        },
        {
          name: 'Google Photos Delete Tool',
          description: 'Chrome extension with JavaScript for bulk photo management.'
        },
        {
          name: 'SotiAds',
          description: 'Automated AdMob unit creation with TypeScript, optimizing revenue with Firebase Remote Config.'
        }
      ]
    }
  ];

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-3">
          <FaTerminal className="text-blue-600 mr-2" />
          <h2 className="text-lg font-mono text-blue-600">$ find /projects -name &quot;*.json&quot; | xargs cat</h2>
        </div>
        
        <div className="space-y-8">
          {projectCategories.map((category, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{category.title} | {category.period}</h3>
              
              <div className="space-y-4">
                {category.projects.map((project, idx) => (
                  <div key={idx} className="bg-gray-100 rounded-lg p-5 shadow-sm">
                    <h4 className="text-lg font-semibold text-blue-600 mb-2">{project.name}</h4>
                    <p className="text-gray-700">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 