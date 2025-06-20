import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Trophy, Users, Zap, Shield, Star, GamepadIcon } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Testimonials Section
  const testimonials = [
    { name: "Arjun Sharma", role: "Pro Gamer", comment: "The tournament system is incredibly smooth. I've won multiple competitions here!", rating: 5 },
    { name: "Priya Patel", role: "Esports Enthusiast", comment: "Love the community aspect. Made so many friends through TheArenaX tournaments.", rating: 5 },
    { name: "Rahul Verma", role: "Casual Player", comment: "Perfect platform for both casual and competitive gaming. Highly recommended!", rating: 5 },
    { name: "Ananya Reddy", role: "Tournament Organizer", comment: "The platform's features make organizing tournaments a breeze. Great experience!", rating: 5 },
    { name: "Vikram Singh", role: "Professional Streamer", comment: "TheArenaX has helped me grow my audience and connect with amazing gamers.", rating: 5 },
    { name: "Meera Kapoor", role: "Esports Coach", comment: "Best platform for training and developing new talent. The community is amazing!", rating: 5 },
    { name: "Karan Malhotra", role: "Competitive Player", comment: "The matchmaking system is fair and the tournaments are well-organized.", rating: 5 },
    { name: "Zara Khan", role: "Gaming Content Creator", comment: "TheArenaX has revolutionized how I create content and engage with my audience.", rating: 5 },
    { name: "Aditya Joshi", role: "Team Captain", comment: "Perfect platform for team tournaments. The features are exactly what we needed.", rating: 5 },
    { name: "Neha Gupta", role: "Gaming Influencer", comment: "The community support and tournament structure are unmatched. Love it!", rating: 5 }
  ];
  const [rowWidth, setRowWidth] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (rowRef.current) {
      setRowWidth(rowRef.current.scrollWidth / 2); // since we duplicate
    }
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight break-words">
              TheArenaX
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the ultimate competitive gaming platform. Compete in tournaments, win prizes, and become a champion.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {isAuthenticated ? (
              <Link to="/tournaments">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 rounded-full">
                  <Trophy className="mr-2 h-5 w-5" />
                  View Tournaments
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 rounded-full">
                  Get Started
                </Button>
              </Link>
            )}
            <Link to="/tournaments">
              <Button variant="outline" size="lg" className="border-2 border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-4 rounded-full">
                <GamepadIcon className="mr-2 h-5 w-5" />
                Explore Games
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent break-words">
              Why Choose TheArenaX?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the next level of competitive gaming with our cutting-edge platform
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Trophy,
                title: "Competitive Tournaments",
                description: "Join tournaments across multiple games and compete for real prizes"
              },
              {
                icon: Shield,
                title: "Secure Platform",
                description: "Your data and transactions are protected with enterprise-grade security"
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                description: "Get instant notifications and live tournament updates"
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Connect with gamers worldwide and build lasting friendships"
              },
              {
                icon: Star,
                title: "Skill-based Matching",
                description: "Fair matchmaking ensures competitive and exciting games"
              },
              {
                icon: GamepadIcon,
                title: "Multiple Games",
                description: "Support for popular games like Valorant, CS:GO, and more"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-gray-900/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/30 transition-all duration-300 hover-scale h-full rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative z-10 overflow-hidden">
        <div className="container mx-auto overflow-hidden">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              What Our Gamers Say
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-x-hidden w-full" style={{ scrollbarWidth: 'none' }}>
              <motion.div
                ref={rowRef}
                className="flex gap-6 no-scrollbar"
                style={{ whiteSpace: 'nowrap' }}
                animate={rowWidth ? { x: [0, -rowWidth] } : false}
                transition={rowWidth ? {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 45,
                    ease: "linear",
                  },
                } : {}}
              >
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="min-w-[280px] flex-shrink-0"
                  >
                    <Card className="bg-gray-900/30 border-gray-700/50 backdrop-blur-sm h-full rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-300 mb-3 text-sm">"{testimonial.comment}"</p>
                        <div>
                          <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                          <p className="text-xs text-gray-400">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 sm:p-8 md:p-12 backdrop-blur-sm text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white break-words">
              Ready to Dominate?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of gamers competing for glory and prizes. Your journey to becoming a champion starts here.
            </p>
            {!isAuthenticated && (
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 rounded-full">
                  Join TheArenaX Now
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
