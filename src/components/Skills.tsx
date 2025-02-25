import { FaTerminal } from 'react-icons/fa';

type SkillCategory = {
  category: string;
  skills: string | React.ReactNode;
};

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      category: 'Languages',
      skills: 'Python, Java, JavaScript, TypeScript, PHP, C#, C, Dart, Go'
    },
    {
      category: 'Frameworks',
      skills: 'Node.js, Nest.js, React, Vue.js (expert), Angular, Flutter, Cocos2d, Unity3D'
    },
    {
      category: 'Tools',
      skills: 'Docker, Kubernetes, GCP, Firebase, Cloud Run, Git, Bun, Socket.IO, Protobuf'
    },
    {
      category: 'Databases',
      skills: 'PostgreSQL, MySQL, Percona, Redis, Firestore'
    },
    {
      category: 'AI & ML',
      skills: (
        <>
          OpenAI, LangChain, LLMs, Reinforcement Learning (PPO, A2C),<br />
          AlphaGo, CNN, RNN/LSTM
        </>
      )
    },
    {
      category: 'Algorithms',
      skills: 'A*, Dijkstra, BFS/DFS, Simhash, LSH, VP Tree, KD-Tree, Client-Server Sync'
    },
    {
      category: 'Paradigms',
      skills: 'Reactive (RxJS), Functional Programming, Microservices'
    },
    {
      category: 'Blockchain',
      skills: 'EOS Smart Contracts, Ethereum, Bitcoin, DEX Architecture'
    },
    {
      category: 'Management',
      skills: 'Team Leadership, Product Management, Strategic Planning, Startup Growth, Marketing, Business Development, UI/UX Direction'
    }
  ];

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-3">
          <FaTerminal className="text-blue-600 mr-2" />
          <h2 className="text-lg font-mono text-blue-600">$ find /skills -type f | sort</h2>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillCategories.map((category, index) => (
              <div key={index} className="mb-3">
                <span className="font-bold text-gray-800">{category.category}:</span>{' '}
                <span className="text-gray-700">{category.skills}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 