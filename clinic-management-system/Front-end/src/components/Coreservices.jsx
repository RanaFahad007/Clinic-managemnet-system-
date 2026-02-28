import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Stethoscope, Microscope } from "lucide-react";

const services = [
  {
    title: "Health Care",
    description:
      "Comprehensive  checkups and advanced treatment for a healthy life.",
    icon: <HeartPulse className="w-12 h-12 text-red-500" />,
    image:
      "https://img.pikbest.com/png-images/qianku/caring-heart-cartoon-vector_2372004.png!sw800",
  },
  {
    title: "General Medicine",
    description:
      "Expert diagnosis and primary healthcare for everyday medical needs.",
    icon: <Stethoscope className="w-12 h-12 text-blue-500" />,
    image:
      "https://t4.ftcdn.net/jpg/14/97/82/87/360_F_1497828787_utBt2pxy7DmSv1l8DrYX6ymBtpYczstm.jpg",
  },
  {
    title: "Laboratory Tests",
    description:
      "Accurate lab tests with quick reports to help you monitor your health.",
    icon: <Microscope className="w-12 h-12 text-green-500" />,
    image:
      "https://static.vecteezy.com/system/resources/previews/035/858/836/non_2x/test-tube-with-blood-sample-in-hand-of-doctor-isolated-general-blood-analysis-laboratory-container-with-red-liquid-medical-plastic-bag-research-medical-analysis-cartoon-flat-illustration-vector.jpg",
  },
];

const Coreservices = () => {
  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-b from-white to-green-50"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-green-500 mb-12">
          Our Core <span className="text-green-500">Services</span>
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden z-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* gradient overlay only for better readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
              </div>

              {/* ensure content sits above the overlay */}
              <div className="relative z-10 p-6 text-left bg-white">
                <div className="mb-3">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Coreservices;
