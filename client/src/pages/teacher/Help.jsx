import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHelpCircle, FiBook, FiMessageCircle,
  FiPhone, FiMail, FiChevronDown 
} from 'react-icons/fi';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I create a new course?',
      answer: 'To create a new course, click the "Create Course" button...'
    },
    // Add more FAQs
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Help Center</h1>
        <p className="text-gray-600">Find answers and support for your questions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SupportCard
          icon={<FiBook />}
          title="Documentation"
          description="Browse our comprehensive guides and tutorials"
        />
        <SupportCard
          icon={<FiMessageCircle />}
          title="Community"
          description="Connect with other instructors and share knowledge"
        />
        <SupportCard
          icon={<FiPhone />}
          title="Contact Support"
          description="Get help from our support team"
        />
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openFaq === faq.id}
              onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SupportCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
      {React.cloneElement(icon, { className: 'w-6 h-6 text-blue-500' })}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
  <motion.div className="border rounded-lg">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4"
    >
      <span className="font-medium text-gray-900">{faq.question}</span>
      <FiChevronDown className={`transform transition-transform ${
        isOpen ? 'rotate-180' : ''
      }`} />
    </button>
    {isOpen && (
      <div className="px-4 pb-4">
        <p className="text-gray-600">{faq.answer}</p>
      </div>
    )}
  </motion.div>
);

export default Help;