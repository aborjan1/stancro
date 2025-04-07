
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = [
    {
      title: "About Kamernet",
      links: [
        { label: "About Kamernet", href: "/about" },
        { label: "Careers at Kamernet", href: "/careers" },
        { label: "Terms and conditions", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
        { label: "Sitemap", href: "/sitemap" },
      ]
    },
    {
      title: "How Does It Work",
      links: [
        { label: "How Does It Work", href: "/how-it-works" },
        { label: "Contact", href: "/contact" },
        { label: "Support", href: "/support" },
        { label: "Useful tips", href: "/tips" },
        { label: "Unsubscribe e-mail", href: "/unsubscribe" },
      ]
    },
    {
      title: "Affiliates",
      links: [
        { label: "Affiliates", href: "/affiliates" },
        { label: "Partnership", href: "/partnership" },
        { label: "Rent out a home", href: "/rent-home" },
        { label: "Rent out a room", href: "/rent-room" },
        { label: "Safety landlord", href: "/safety" },
      ]
    }
  ];

  return (
    <footer className="bg-[#0B1638] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerLinks.map((column, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-medium text-lg">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} StanCro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
