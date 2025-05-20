
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose StanCro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Verified Student Housing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>All listings are verified to ensure they meet student housing standards and requirements.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Budget-Friendly Options</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Find accommodations that fit your budget with transparent pricing and no hidden fees.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Close to Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discover housing options located near your university for convenient access to campus.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
