
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Page Content with padding for the fixed navbar */}
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">About StanCro</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="mb-4">
                StanCro was founded with a simple mission: to make finding student housing in Croatia easier, safer, and more efficient. 
                We recognized the challenges that both local and international students face when searching for accommodation and decided to create a solution.
              </p>
              <p>
                Our platform connects students directly with verified landlords, eliminating the confusion and potential risks of searching across multiple platforms or dealing with unreliable listings.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="mb-6">
                StanCro was created by Team Stanko, a group of passionate individuals committed to improving the student housing experience in Croatia:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Antonio Borjan</h3>
                  <p className="text-muted-foreground">Co-Founder</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Dora Jurić</h3>
                  <p className="text-muted-foreground">Co-Founder</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Simone Jurcan</h3>
                  <p className="text-muted-foreground">Co-Founder</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Rafael Bistričić</h3>
                  <p className="text-muted-foreground">Co-Founder</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                Have questions or feedback about StanCro? We'd love to hear from you!
              </p>
              <p className="mb-2">
                <strong>Email:</strong> info@stancro.com
              </p>
              <p>
                <strong>Address:</strong> University of Zagreb, Zagreb, Croatia
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} StanCro. All rights reserved.</p>
            <p className="text-gray-400">Created by Team Stanko</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
