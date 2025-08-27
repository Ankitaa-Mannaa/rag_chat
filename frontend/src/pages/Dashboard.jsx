// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import docBg from "../assets/document card.jpg";
import searchBg from "../assets/search card.jpg";
import askBg from "../assets/ask card.jpg";
import usageBg from "../assets/track card.jpg";

const pages = [
  { 
    title: "Documents", 
    desc: "Upload and manage your documents. There's no limit of uploading you can upload anytime anywhere you want and out Reasonbot platfrom will store and save the text indexes in our databases, so that anytime you can access our features without uploading again.", 
    to: "/documents",
    icon: "📄",
    gradient: "from-blue-500 to-blue-600",
    hoverGradient: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-50/80",
    borderColor: "border-blue-200/60",
    bgImage: docBg
  },
  { 
    title: "Search", 
    desc: "Couldn't find any context? Run semantic search across documents you uploaded. This will show you the closest paragraphs that matches your query about the document and will send you right away. No need to search for documents again as we will show you from which document the context is taken.", 
    to: "/search",
    icon: "🔍",
    gradient: "from-green-300 to-emerald-600",
    hoverGradient: "from-green-600 to-emerald-700",
    bgColor: "bg-green-50/80",
    borderColor: "border-green-200/60",
    bgImage: searchBg
  },
  { 
    title: "Ask", 
    desc: "Ask our ReasonBot AI questions about your documents. No need to specify the document our AI will be fed the right context according to your question from the desired document. Our ReasonBot AI tailors the context and gives you a well narrated and well-written answer.", 
    to: "/ask",
    icon: "🤖",
    gradient: "from-purple-500 to-purple-600",
    hoverGradient: "from-purple-600 to-purple-700",
    bgColor: "bg-purple-50/80",
    borderColor: "border-purple-200/60",
    bgImage: askBg
  },
  { 
    title: "Usage", 
    desc: "View your usage statistics. This helps to track the usage of our AI as more than 100 AI searches in a day is not allowed. There are always some things you need to compromise to go free right!", 
    to: "/usage",
    icon: "📊",
    gradient: "from-orange-500 to-orange-600",
    hoverGradient: "from-orange-600 to-orange-700",
    bgColor: "bg-orange-50/80",
    borderColor: "border-orange-200/60",
    bgImage: usageBg
  },
];

export default function Dashboard() {
  return (
    <div className="h-full p-4">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-900 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-4">
            Welcome Back to ReasonBot
          </h1>
          <p className="text-xl italic text-gray-600 font-medium max-w-2xl mx-auto">
            Your AI-powered workspace is ready. Choose a feature below to get started with intelligent document analysis.
          </p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
          {pages.map((p) => (
            <Link
              to={p.to}
              key={p.title}
              className="group relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
            >
              {/* Background Image with Transparency */}
              <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-40 transition-opacity duration-500"
                style={{ backgroundImage: `url(${p.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
              ></div>

              {/* Overlay color hover */}
              <div className={`absolute inset-0 ${p.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col h-full">
                {/* Icon and Arrow */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${p.gradient} group-hover:${p.hoverGradient} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                    <span className="text-2xl">{p.icon}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-900 transition-colors duration-200">
                  {p.title}
                </h2>
                
                {/* Description */}
                <p className="text-gray-600 text-base leading-relaxed font-medium group-hover:text-gray-700 transition-colors duration-200 flex-grow">
                  {p.desc}
                </p>

                 {/* Bottom accent line */}
                <div className={`mt-6 h-1 bg-gradient-to-r ${p.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 border-2 ${p.borderColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
