
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    {
      title: "About StanCro",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Sitemap", href: "/sitemap" },
      ]
    },
    {
      title: "For Students",
      links: [
        { label: "How It Works", href: "/how-it-works" },
        { label: "Student Guide", href: "/student-guide" },
        { label: "University Areas", href: "/university-areas" },
        { label: "Roommate Finder", href: "/roommate-finder" },
        { label: "FAQ", href: "/faq" },
      ]
    },
    {
      title: "For Landlords",
      links: [
        { label: "List Your Property", href: "/list-property" },
        { label: "Landlord Guide", href: "/landlord-guide" },
        { label: "Property Management", href: "/property-management" },
        { label: "Safety Guidelines", href: "/safety" },
        { label: "Support", href: "/support" },
      ]
    }
  ];

  return (
    <footer className="bg-[#0B1638] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-xl">StanCro</h3>
            <p className="text-gray-300">Croatia's premier platform for student housing solutions.</p>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
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
        <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} StanCro. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/help" className="hover:text-white">Help Center</Link>
            <Link to="/press" className="hover:text-white">Press</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
