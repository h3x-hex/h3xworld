'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Zap, Shield, Globe, Star, ArrowRight, Sparkles, ChevronDown, Router } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import H3xCard from "../H3xCard";
import { useRouter } from "next/navigation";

const Hero = () => {
    const router = useRouter();
    const isDesktop = useMediaQuery({ minWidth: 551 });
    const isMobile = useMediaQuery({ maxWidth: 550 }); 

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [addedToWaitlist, setAddedToWaitlist] = useState(false);

    const [email, setEmail] = useState('');
  
    // Typewriter effect state
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    
    const words = ["Brand", "Portfolio", "Shop", "Link in Bio", "Community", "Services"];
    
    useEffect(() => {
        const timeout = setTimeout(() => {
        const currentWord = words[currentWordIndex];
        
        if (isDeleting) {
            setCurrentText(currentWord.substring(0, currentText.length - 1));
        } else {
            setCurrentText(currentWord.substring(0, currentText.length + 1));
        }
        
        if (!isDeleting && currentText === currentWord) {
            setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && currentText === "") {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
        }, isDeleting ? 50 : 100);
        
        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentWordIndex, words]);

    const features = [
        {
        icon: <Zap className="w-6 h-6" />,
        title: "Unlimited Posts",
        description: "Share your creativity without limits"
        },
        {
        icon: <Globe className="w-6 h-6" />,
        title: "Global Network",
        description: "Connect with creators worldwide"
        },
        {
        icon: <Shield className="w-6 h-6" />,
        title: "Secure Platform",
        description: "Your data and content are protected"
        },
        {
        icon: <Star className="w-6 h-6" />,
        title: "Premium Features",
        description: "Advanced tools for creators"
        }
    ];

    const pricingPlans = [
        {
        name: "Free",
        price: "$0",
        period: "/month",
        features: [
            "Unlimited Posts",
            "Unlimited Product Listings & Affiliate Products",
            "Unlimited Links",
            "Book/Sell Appointments and Services",
            "Sell Digital Products",
            "h3xclusive Members-only Content",
        ],
        popular: false
        },
        {
        name: "h3xPro",
        price: "$8.88",
        period: "/month",
        features: [
            "All Free features",
            "Create Clubs for community building",
            "Advanced Analytics",
            "Verified Badge",
            "100GB Storage for Shop and Content (Unlimited after beta)",
            "AI integration, Ad Credits and more features coming soon after beta"
        ],
        popular: true
        },
        {
        name: "h3xMax",
        price: "$36.9",
        period: "/month",
        features: [
            "All h3xPro features",
            "Golden Verified Badge",
            "Featured Feed Visibility",
            "1TB Storage for Shop and Content (Unlimited after beta)",
            "AI integration, Ad Credits and more features coming soon after beta"
        ],
        popular: false
        }
    ];

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen">
        {/* Navigation Header */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center">
                <img 
                    src="/logo.png" 
                    alt="h3x.world logo" 
                    className="h-8 w-8 mr-2" 
                />
                <span className="text-xl font-bold">
                    h<span className="text-creator-gold">3</span>x.world
                </span>
                </div>
                
                {/* Center Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                <Button 
                    variant="ghost" 
                    className="text-foreground hover:text-creator-gold"
                    onClick={() => scrollToSection('features')}
                >
                    Features
                </Button>
                <Button 
                    variant="ghost" 
                    className="text-foreground hover:text-creator-gold"
                    onClick={() => scrollToSection('nfc-card')}
                >
                    h3xCard
                </Button>
                <Button 
                    variant="ghost" 
                    className="text-foreground hover:text-creator-gold"
                    onClick={() => scrollToSection('pricing')}
                >
                    Pricing
                </Button>
                </div>
                
                {/* Join Button */}
                <Button 
                className="bg-creator-gold hover:bg-creator-gold/90 text-black font-semibold tracking-tight"
                onClick={() => router.push("/auth/login")}
                >
                Join h3x.world
                </Button>
            </div>
            </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32 pt-24 sm:pt-28 md:pt-40">
            <div className="absolute inset-0 bg-gradient-to-br from-creator-gold/5 via-transparent to-creator-gold/10 h-screen" />
            
            <div className="max-w-7xl mx-auto text-center relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 sm:space-y-6"
            >
                <div className="inline-flex items-center gap-2 bg-creator-gold/10 text-creator-gold px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Now in Beta
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Build your{" "}
                <span className="inline-block text-creator-gold">
                    {currentText}
                    <span className="animate-pulse">|</span>
                </span>{" "}
                with h<span className="text-creator-gold">3</span>x.world
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Packed with features to help you{" "}
                <span className="text-creator-gold font-semibold">monetize your content</span>{" "}
                and products while building meaningful connections
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6 sm:pt-8 px-4">
                <Button 
                    size="lg" 
                    className="bg-creator-gold hover:bg-creator-gold/90 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                    onClick={() => router.push("/auth/login")}
                >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
                <Button 
                    variant="outline" 
                    size="lg"
                    className="border-creator-gold/30 text-creator-gold hover:bg-creator-gold/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                >
                    Learn More
                </Button>
                </div>
            </motion.div>
            
            {/* Down Arrow */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="cursor-pointer"
                onClick={() => scrollToSection('features')}
                >
                <ChevronDown className="w-8 h-8 text-creator-gold" />
                </motion.div>
            </motion.div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-creator-gold/5">
            <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
            >
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Powerful Features for{" "}
                <span className="text-creator-gold">Creators</span>
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Everything you need to build, grow, and monetize your digital presence
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {features.map((feature, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                >
                    <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 hover:scale-105 h-full">
                    <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-creator-gold mb-3 sm:mb-4 flex justify-center">
                        {feature.icon}
                        </div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">{feature.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                    </Card>
                </motion.div>
                ))}
            </div>
            </div>
        </section>

        {/* NFC Card Section */}
        <section id="nfc-card" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
            <div className="relative bg-stone-950 pb-32 pt-8 flex" id='h3xCard'>
                <div className="mx-auto flex flex-col text-center ">
                    <h2 className="text-lg font-semibold text-yellow-500">h3xCard</h2>
                    <p className="mt-2 text-6xl font-semibold tracking-tight text-balance text-gray-100">
                        NFC Business Card. Network with a single tap. 
                    </p>
                    <div className="mx-auto gap-3">
                        <p className='py-6 text-gray-300 sm:text-xl/8'>Fun fact: Card is in 3D Space, you can move it around.</p>
                        { 
                            isMobile && 

                            <div className="flex flex-wrap py-8 h-[24rem] w-screen bg-stone-900">
                                <Canvas className='w-10/12 h-48'>
                                    <ambientLight intensity={100}/>
                                    <OrbitControls enableZoom={false}/>
                                    <H3xCard scale={[0.4, 0.4, 0.4]}/>
                                </Canvas>
                            </div>
                        }

                        { 
                            isDesktop && 

                            <div className="flex flex-wrap py-8 h-[36rem] w-screen bg-stone-900">
                                <Canvas className='w-10/12 h-96'>
                                    <ambientLight intensity={100}/>
                                    <OrbitControls enableZoom={false}/>
                                    <H3xCard scale={[0.4, 0.4, 0.4]}/>
                                </Canvas>
                            </div>
                        }
                        <div className='pt-8'><button className='btn bg-yellow-500 border-2 border-yellow-500 shadow-none w-36 text-black rounded-full'>Coming Soon</button></div>
                    </div>
                </div>
            </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
            >
                <p className="text-creator-gold font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Pricing</p>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                    Pricing that grows with you
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
                    Choose an affordable plan that's packed with the best features for
                    engaging your audience, creating customer loyalty, and driving sales.
                </p>
                <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-creator-gold/10 rounded-lg max-w-4xl mx-auto">
                <p className="text-xs sm:text-sm text-muted-foreground">
                    <span className="font-semibold text-creator-gold">Support Creators. Power the Platform.</span> Your payment goes directly to the creator
                    — they keep 100% of what they earn. We just add a small 8.88% h<span className="text-creator-gold">3</span>x.world fee to
                    keep this platform free, open, and creator-first. You're not just buying content —
                    You're fueling the future of digital independence.
                </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                {pricingPlans.map((plan, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                >
                    <Card className={`relative h-full ${
                    plan.popular 
                        ? 'border-creator-gold bg-gradient-to-b from-creator-gold/10 to-transparent' 
                        : 'bg-gradient-card border-border'
                    }`}>
                    {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-creator-gold text-black px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            Most Popular
                        </span>
                        </div>
                    )}
                    
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="mb-4 sm:mb-6">
                        <span className="text-3xl sm:text-4xl font-bold text-creator-gold">{plan.price}</span>
                        <span className="text-muted-foreground text-sm sm:text-base">{plan.period}</span>
                        </div>
                        
                        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                        {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 sm:gap-3">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-creator-gold flex-shrink-0" />
                            <span className="text-xs sm:text-sm">{feature}</span>
                            </li>
                        ))}
                        </ul>
                        
                        <Button 
                        className={`w-full ${
                            plan.popular
                            ? 'bg-creator-gold hover:bg-creator-gold/90 text-black'
                            : 'border-creator-gold/30 text-creator-gold hover:bg-creator-gold/10'
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                        size="sm"
                        >
                        Get Started
                        </Button>
                    </CardContent>
                    </Card>
                </motion.div>
                ))}
            </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-creator-gold/10 via-creator-gold/5 to-creator-gold/10">
            <div className="max-w-4xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-4 sm:space-y-6"
            >
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
                {
                    addedToWaitlist ?

                    <h1  className='text-xl mx-auto pb-3'>Joined the h<span className='text-creator-gold'>3</span>x<span className='text-[#888888]'>.</span>world beta waitlist. Thank you and see you soon!</h1>
                    :
                    <h1  className='text-xl mx-auto pb-3'>Join the h<span className='text-creator-gold'>3</span>x<span className='text-[#888888]'>.</span>world beta waitlist.</h1>
                }
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground px-4">
                    Be among the first to experience the future of creator economy
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto px-4">
                <Input 
                    placeholder="Enter your email"
                    className="flex-1 bg-background border-creator-gold/30 text-sm sm:text-base"
                />
                <Button 
                    className="bg-creator-gold hover:bg-creator-gold/90 text-black font-semibold text-sm sm:text-base w-full sm:w-auto"
                    onClick={() => router.push("/profile")}
                >
                    Join h3x.world
                </Button>
                </div>
            </motion.div>
            </div>
        </section>
        </div>
    );
};

export default Hero;