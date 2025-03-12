
import { useEffect, useState } from "react";
import { ChevronRight, Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AboutPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-background overflow-hidden">
      {/* Hero section with parallax */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(6,147,227,0.8) 0%, rgba(155,81,224,0.8) 100%)",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />
        
        <div className="z-10 text-center px-6 max-w-3xl">
          <h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ transform: `translateY(${-scrollY * 0.1}px)` }}
          >
            About Hearth
          </h1>
          <p 
            className="text-xl text-white/90 mb-8"
            style={{ transform: `translateY(${-scrollY * 0.05}px)` }}
          >
            Your AI Health Assistant, designed to provide personalized health insights through natural conversation
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            style={{ transform: `translateY(${-scrollY * 0.02}px)` }}
          >
            <Link to="/chat">
              Try Now <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-16">
        <Link to="/" className="flex items-center text-primary hover:underline mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At Hearth, we believe healthcare should be accessible, personalized, and conversational. 
              Our AI health assistant combines cutting-edge artificial intelligence with medical knowledge 
              to provide you with insights about your health concerns.
            </p>
            <p className="text-muted-foreground">
              While we don't replace medical professionals, we aim to be your first point of contact 
              for health questions, guiding you to appropriate care when needed.
            </p>
          </div>
          <div 
            className="relative rounded-xl overflow-hidden h-64 md:h-auto" 
            style={{ transform: `translateY(${scrollY * 0.02}px)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-90 z-0"></div>
            <div className="relative z-10 h-full flex items-center justify-center p-6 text-center">
              <div>
                <Heart className="h-16 w-16 text-white mb-4 mx-auto" />
                <h3 className="text-2xl font-semibold text-white">Caring for your health through conversation</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Talk to Hearth",
                description: "Speak naturally about your health concerns or questions to our AI assistant."
              },
              {
                number: "02",
                title: "Get AI Insights",
                description: "Hearth analyzes your concerns and provides personalized health information."
              },
              {
                number: "03",
                title: "Take Action",
                description: "Use Hearth's recommendations to make informed decisions about your health."
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="glass-panel p-6 rounded-xl relative"
                style={{ transform: `translateY(${scrollY * 0.03 * (index + 1)}px)` }}
              >
                <span className="text-6xl font-bold text-primary/10 absolute top-4 right-4">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                question: "Is Hearth a replacement for medical professionals?",
                answer: "No, Hearth is not a replacement for healthcare professionals. Our AI assistant provides information and guidance, but you should always consult with qualified medical professionals for diagnosis, treatment, and medical advice."
              },
              {
                question: "How accurate is Hearth's health information?",
                answer: "Hearth uses advanced AI algorithms trained on medical information, but it's not perfect. We strive for high accuracy, but always consult healthcare professionals for critical health decisions."
              },
              {
                question: "Is my health data private and secure?",
                answer: "Yes, your privacy is our priority. All conversations are encrypted, and we follow strict data protection protocols. Your health information is never shared with third parties without your explicit consent."
              },
              {
                question: "Can Hearth diagnose medical conditions?",
                answer: "Hearth cannot provide official medical diagnoses. It can suggest possible explanations for symptoms and provide general health information, but only qualified healthcare professionals can diagnose medical conditions."
              },
              {
                question: "Is Hearth available 24/7?",
                answer: "Yes! As an AI assistant, Hearth is available to answer your health questions anytime, day or night."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Footer with parallax effect */}
      <div 
        className="relative py-16 overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(6,147,227,0.9) 0%, rgba(155,81,224,0.9) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to try Hearth?</h2>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link to="/chat">
              Start Chatting Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
