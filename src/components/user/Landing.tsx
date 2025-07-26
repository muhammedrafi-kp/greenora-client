import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png'
import banner from '../../assets/20036.jpg';
import whoWeAreImage from '../../assets/greenora-banner.jpeg';
import wasteCollection from '../../assets/waste-collection.png';
import recycling from '../../assets/recycling.png';
import scrap from '../../assets/Scrap.png';
import tracking from '../../assets/tracking.png';
import ecoFriendly from '../../assets/eco-friendly.png';
import subscription from '../../assets/subsciption.png';
import wasteManagmnetIndia from '../../assets/waste-managment-india.jpg';
import AuthModal from './AuthModal';
import { FaInstagram, FaFacebook, FaLinkedin  } from "react-icons/fa";
import { IoLocationOutline,IoMailOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";

const Landing: React.FC = () => {
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const navigate = useNavigate();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleSchedulePickup = () => {
        if (isLoggedIn) {
            navigate('/pickup');
        } else {
            setShowAuthModal(true);
        }
    };

    const closeModal = () => {
        setShowAuthModal(false);
    };

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const serviceCardHover = {
        rest: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <>
            <div className="w-full lg:mt-16 mt-11 min-h-screen">
                {/* Hero Section with Animated Text */}
                <motion.div
                    className="w-full h-[50vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${banner})` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <section className="flex flex-col items-center justify-center h-full text-white bg-black bg-opacity-75 p-4">
                        <motion.h1
                            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            Transforming Waste into <br />
                            Sustainable <span className="text-yellow-400">Tomorrow</span>
                        </motion.h1>

                        <motion.p
                            className="mt-5 text-center text-sm sm:text-base md:text-lg font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        >
                            Together, We Recycle, Renew, and Reimagine Our World!
                        </motion.p>

                        <motion.button
                            onClick={handleSchedulePickup}
                            className="mt-6 bg-green-800 hover:bg-green-900 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Schedule a pickup
                        </motion.button>
                    </section>
                </motion.div>

                {/* Who We Are Section with Scroll Animation */}
                <motion.section
                    id="about"
                    className="bg-green-100 p-10 sm:p-10 md:p-20 w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    variants={fadeInUp}
                >
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 w-full">
                        <motion.div
                            className="md:w-1/2"
                            variants={fadeInUp}
                        >
                            <h2 className="text-green-900 text-xl sm:text-2xl md:text-3xl font-bold mb-4">Who we are?</h2>
                            <p className="text-gray-800 text-xs md:text-sm lg:text-base font-medium leading-relaxed">
                                <strong>At Greenora,</strong> we are on a mission to revolutionize waste management by making sustainability accessible to everyone. Our innovative platform empowers individuals, communities, and businesses to take control of their waste by promoting responsible disposal, recycling, and eco-friendly practices.
                            </p>

                            <p className="mt-4  text-xs md:text-sm lg:text-base text-gray-800 font-medium leading-relaxed">
                                Driven by a vision of a cleaner, greener planet, Greenora combines technology and community engagement to transform how waste is managed, turning challenges into opportunities for a sustainable future. Together, let's reduce, reuse, and rethink waste for a better tomorrow.
                            </p>
                        </motion.div>
                        <motion.div
                            className="md:w-1/2 flex justify-center"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={whoWeAreImage} alt="Waste Management" className="rounded-lg shadow-lg w-full h-full" />
                        </motion.div>
                    </div>
                </motion.section>

                {/* Services Section with Card Animations */}
                <section className="bg-gray-50 p-8 sm:p-10 md:p-20" id="services">
                    <motion.h2
                        className="text-xl sm:text-2xl md:text-3xl text-center font-bold mb-8 text-green-900"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Our Services
                    </motion.h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto px-4">
                        {[
                            { icon: wasteCollection, title: "Waste Collection & Disposal", description: "Efficient and eco-friendly waste collection services designed to ensure proper disposal and minimize environmental impact." },
                            { icon: recycling, title: "Recycling Solutions", description: "Comprehensive recycling programs that turn waste into valuable resources, promoting a circular economy and reducing landfill waste." },
                            { icon: scrap, title: "Scrap Collection", description: "Specialized scrap collection services for old electronics, metal, and other scrap materials, ensuring safe and responsible recycling." },
                            { icon: tracking, title: "Real-Time Pick-up Tracking", description: "Advanced tracking system that provides real-time updates on waste collection, recycling progress, and overall impact." },
                            { icon: ecoFriendly, title: "Eco-Friendly Awareness Programs", description: "Educational initiatives and workshops aimed at raising awareness about sustainable waste management practices and environmental conservation." },
                            { icon: subscription, title: "Custom Plans", description: "Tailored solutions for businesses, communities, and individuals to manage waste effectively and meet specific sustainability goals." }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-6 text-start cursor-pointer"
                                variants={serviceCardHover}
                                initial="rest"
                                whileHover="hover"
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl mb-4 w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                                    <img src={service.icon} alt="" className="w-full h-full object-contain" />
                                </div>
                                <h6 className="text-base md:text-lg lg:text-xl font-semibold">{service.title}</h6>

                                <p className="text-gray-700 mt-2 text-xs md:text-sm lg:text-base font-medium">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Did you know Section with Scroll Animation */}
                <motion.section
                    className="bg-green-100 p-10 sm:p-10 md:p-20 w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 w-full">
                        <motion.div
                            className="md:w-1/2 flex justify-center"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={wasteManagmnetIndia} alt="Waste Management" className="rounded-lg shadow-lg w-full h-full" />
                        </motion.div>
                        <motion.div
                            className="md:w-1/2"
                            variants={fadeInUp}
                        >
                            <h2 className="text-green-900 text-xl sm:text-2xl md:text-3xl font-bold mb-4">Did you Know?</h2>
                            <p className="text-gray-800 text-xs md:text-sm lg:text-base font-medium leading-relaxed">
                                <strong>India</strong> generates approximately <strong>170,338 tonnes</strong> of solid waste every day, but only <strong>53%</strong>  of it is treated. By <strong>2030</strong>, urban waste generation is projected to reach a staggering <strong>165 million tonnes</strong>, making efficient waste management more critical than ever. To address this, the government has implemented <strong>Extended Producer Responsibility (EPR)</strong> regulations for plastics, batteries, e-waste, and other materials, promoting recycling and a circular economy.
                                <br />
                                <strong>At Greenora</strong>, we're dedicated to being part of the solution. One collection at a time, we aim to transform waste into a valuable resource for a sustainable future. Join us in creating a cleaner, greener tomorrow!
                                <br />                            </p>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Statistics Section */}
                <motion.section
                    className="bg-gray-900 p-10 sm:p-12 md:p-15 w-full relative"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cdefs%3E%3Cpattern id=\'grain\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'1\' fill=\'%23ffffff\' opacity=\'0.1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23grain)\'/%3E%3C/svg%3E")'
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { number: "4", label: "Years of Experience" },
                                { number: "1k+", label: "Happy Customers" },
                                { number: "10+", label: "Partners" },
                                { number: "5", label: "Districts in Kerala" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm md:text-base text-white font-medium">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Customer Testimonials Section */}
                <motion.section
                    className="bg-white p-10 sm:p-10 md:p-20 w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 text-green-800"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            What Customers Say
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {[
                                {
                                    quote: "Efficient & Reliable Service!",
                                    text: "Greenora has completely transformed how we manage waste in our community. Their prompt service and eco-friendly solutions have made a significant difference in reducing our environmental footprint.",
                                    reviewer: "Ravi M., Community Organizer"
                                },
                                {
                                    quote: "A Step Towards Sustainability!",
                                    text: "I love how Greenora integrates technology with waste management. Their real-time tracking and recycling programs have made it easy for us to contribute to a cleaner planet.",
                                    reviewer: "Aditi S., Business Owner"
                                },
                                {
                                    quote: "Highly Recommended!",
                                    text: "Their scrap collection service is fantastic! It's great to see old materials being recycled responsibly, helping reduce landfill waste.",
                                    reviewer: "Rajesh P., Resident"
                                },
                                {
                                    quote: "Game-Changer for Waste Management!",
                                    text: "Greenora's approach to waste management is both innovative and impactful. Their commitment to sustainability inspires others to join the cause.",
                                    reviewer: "Priya L., Environmental Activist"
                                }
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                >
                                    <div className="flex items-start mb-4">
                                        <span className="text-yellow-400 text-xl mr-2">⭐</span>
                                        <h3 className="font-bold text-lg text-gray-800">{testimonial.quote}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4 leading-relaxed">{testimonial.text}</p>
                                    <p className="text-sm text-gray-500">- {testimonial.reviewer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Footer Section */}
                <footer className="bg-green-900 text-white">
                    <div className="max-w-7xl mx-auto p-8 md:p-12">
                        {/* Top Section */}
                        <div className="border-b border-gray-300 pb-8 mb-8">
                            <div className="flex flex-col md:flex-row justify-between items-start">
                                <div className="mb-6 md:mb-0">
                                    <div className="flex items-center mb-3 gap-3">
                                        <img src={logo}
                                            alt="Greenora logo"
                                            className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white "
                                        />
                                        <h1 className="text-2xl font-bold mr-2">Greenora</h1>

                                    </div>
                                    <p className="text-sm mb-4"> <strong>Recycle for a better tomorrow.</strong> </p>
                                    <div className="flex items-center">
                                        <span className="text-sm mr-2">Follow Greenora on</span>
                                        <div className="flex space-x-3">
                                            <a href="#" className="w-6 h-6  rounded-full flex items-center justify-center">
                                                {/* <span className="text-green-900 text-xs">📷</span> */}
                                                <FaInstagram className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </a>
                                            <a href="#" className="w-6 h-6  rounded-full flex items-center justify-center">
                                                <FaFacebook className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </a>
                                            <a href="#" className="w-6 h-6 rounded-full flex items-center justify-center">
                                                <FaLinkedin className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            {/* Services */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">Services</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Waste Collection & Disposal</a></li>
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Recycling Solutions</a></li>
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Scrap Collection</a></li>
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Eco-Friendly Awareness Programs</a></li>
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Real-Time Waste Tracking</a></li>
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Custom Waste Management Plans</a></li>
                                </ul>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                                <p className="text-sm mb-4">Feel free to contact and reach us!</p>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start">
                                        <div className="w-4 h-4 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                            {/* <span className="text-white text-xs">📍</span> */}
                                            <IoLocationOutline className="h-4 w-5 text-yellow-500" />

                                        </div>
                                        <p>Greenora Private Limited, Kakkanchery Chelembra PO, Thenhipalam, Kerala 673634</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full flex items-center justify-center mr-3">
                                            <LuPhone className="h-4 w-5 text-yellow-400" />
                                        </div>
                                        <p>+91 773638XXXX</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4  rounded-full flex items-center justify-center mr-3">
                                            <IoMailOutline className="h-4 w-5 text-yellow-400" />
                                        </div>
                                        <p>greenorainfo@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Regions */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">Regions</h3>
                                <ul className="space-y-2 text-sm">
                                    {['Malappuram', 'Calicut', 'Palakkad', 'Thrissure'].map((region, index) => (
                                        <li key={index} className="flex items-center">
                                            <div className="w-4 h-4 rounded-full flex items-center justify-center mr-3">
                                            <IoLocationOutline className="h-4 w-5 text-yellow-500" />
                                            </div>
                                            <a href="#" className="hover:text-green-300 transition-colors">{region}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">Support</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Contact Us</a></li>
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Terms & Conditions</a></li>
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Cancellation Policy</a></li>
                                    <li><a href="#" className="hover:text-green-300 transition-colors">Refund Policy</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="border-t border-gray-300 pt-6">
                            <p className="text-center text-sm text-gray-300">
                                CopyRight © Greenora Private Limited. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {showAuthModal && <AuthModal closeModal={closeModal} />}

        </>
    );
};

export default Landing;







