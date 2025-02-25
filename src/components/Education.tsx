import { FaTerminal, FaGraduationCap, FaLanguage, FaIdCard } from 'react-icons/fa';

export default function Education() {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          {/* Education */}
          <div>
            <div className="flex items-center mb-3">
              <FaTerminal className="text-blue-600 mr-2" />
              <h2 className="text-lg font-mono text-blue-600">$ cat /etc/education</h2>
            </div>
            <div className="bg-gray-100 rounded-lg p-5 shadow-sm">
              <div className="flex items-start">
                <FaGraduationCap className="text-gray-700 mt-1 mr-3 text-xl" />
                <div>
                  <p className="font-bold text-gray-800">Bachelor of Science in Computer Science | Chinese University of Hong Kong | 2007 — 2011</p>
                  <p className="text-gray-700">Exchange Program | KTH Royal Institute of Technology, Sweden | 2010</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Languages */}
          <div>
            <div className="flex items-center mb-3">
              <FaTerminal className="text-blue-600 mr-2" />
              <h2 className="text-lg font-mono text-blue-600">$ locale</h2>
            </div>
            <div className="bg-gray-100 rounded-lg p-5 shadow-sm">
              <div className="flex items-start">
                <FaLanguage className="text-gray-700 mt-1 mr-3 text-xl" />
                <div>
                  <p><span className="font-bold text-gray-800">Fluent:</span> English, Cantonese, Mandarin</p>
                  <p><span className="font-bold text-gray-800">Beginner:</span> Swedish (highly motivated to learn and integrate into Swedish culture)</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Memberships */}
          <div>
            <div className="flex items-center mb-3">
              <FaTerminal className="text-blue-600 mr-2" />
              <h2 className="text-lg font-mono text-blue-600">$ id</h2>
            </div>
            <div className="bg-gray-100 rounded-lg p-5 shadow-sm">
              <div className="flex items-start">
                <FaIdCard className="text-gray-700 mt-1 mr-3 text-xl" />
                <div>
                  <p className="font-bold text-gray-800">Member of Mensa International | UK, HK, and International | 2004 — Present</p>
                  <p className="text-gray-700">Reflects exceptional analytical and problem-solving skills applied to complex technical challenges.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 