import React from 'react';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
}

export const Terms: React.FC<LegalPageProps> = ({ onBack }) => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#ea580c] mb-6 font-medium transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </button>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 rounded-xl text-[#ea580c]">
          <FileText size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
      </div>
      <div className="prose prose-orange text-gray-600 space-y-4">
        <p>Last updated: October 2023</p>
        <h3 className="text-xl font-bold text-gray-800">1. Introduction</h3>
        <p>Welcome to Campus Crave. By accessing our website and using our services, you agree to be bound by these terms.</p>
        <h3 className="text-xl font-bold text-gray-800">2. Use of Services</h3>
        <p>Our service is exclusively for students and staff of the registered campus. You agree to provide accurate location data for deliveries.</p>
        <h3 className="text-xl font-bold text-gray-800">3. Orders and Payments</h3>
        <p>All orders are subject to kitchen availability. Prices are listed in PKR and include applicable taxes.</p>
        <h3 className="text-xl font-bold text-gray-800">4. User Conduct</h3>
        <p>You agree not to misuse the AI Chatbot or harass riders. Violation may result in account suspension.</p>
      </div>
    </div>
  </div>
);

export const Privacy: React.FC<LegalPageProps> = ({ onBack }) => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#ea580c] mb-6 font-medium transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </button>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <Shield size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      </div>
      <div className="prose prose-blue text-gray-600 space-y-4">
        <p>Last updated: October 2023</p>
        <h3 className="text-xl font-bold text-gray-800">1. Data Collection</h3>
        <p>We collect your name, email, phone number, and order history to facilitate deliveries and improve recommendations.</p>
        <h3 className="text-xl font-bold text-gray-800">2. Location Data</h3>
        <p>We use your selected location within the campus solely for the purpose of efficient routing for our riders.</p>
        <h3 className="text-xl font-bold text-gray-800">3. AI Processing</h3>
        <p>Conversations with CraveBot are processed to provide food recommendations. These interactions are anonymized for training purposes.</p>
      </div>
    </div>
  </div>
);