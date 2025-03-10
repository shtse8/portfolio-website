import { FaTerminal } from 'react-icons/fa';

export default function Profile() {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-3">
          <FaTerminal className="text-blue-600 mr-2" />
          <h2 className="text-lg font-mono text-blue-600">$ whoami</h2>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
          <p className="text-gray-800 leading-relaxed">
            Full Stack Developer with 20+ years of experience architecting distributed systems, game platforms, blockchain solutions, and advanced web applications. 
            Expert in Python, Java, Node.js, and cloud technologies (GCP, Docker), delivering scalable platforms with 99.99% uptime for millions of users. 
            Skilled in both frontend and backend development across multiple technology stacks.
            Specialized in Unity3D game development, AI-driven automation, and semantic web tools, with a passion for rapid learning and technical excellence. 
            Studied at KTH Sweden.
          </p>
        </div>
      </div>
    </section>
  );
} 