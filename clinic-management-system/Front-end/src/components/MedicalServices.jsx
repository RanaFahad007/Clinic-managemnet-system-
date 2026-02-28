import React from "react";
import { motion } from "framer-motion";
import { Syringe, Bandage, ActivitySquare } from "lucide-react"; // nice medical icons

const medicalServices = [
  {
    title: "Vaccinations",
    description:
      "Stay protected with our safe and effective vaccination services for all age groups.",
    icon: <Syringe className="w-12 h-12 text-green-500" />,
    image:
      "https://static.vecteezy.com/system/resources/previews/001/861/362/non_2x/vaccine-and-syringe-for-prevention-covid-19-vector.jpg",
  },
  {
    title: "Emergency Care",
    description:
      "24/7 emergency medical assistance with quick response and professional staff.",
    icon: <ActivitySquare className="w-12 h-12 text-green-500" />,
    image:
      "https://www.shutterstock.com/shutterstock/videos/1016039815/thumb/12.jpg?ip=x480",
  },
  {
    title: "Wound Dressing",
    description:
      "Professional wound cleaning, bandaging and post-treatment care to ensure fast recovery.",
    icon: <Bandage className="w-12 h-12 text-green-500" />,
    image:
      "https://media.istockphoto.com/id/1296879862/vector/concept-of-the-human-hand-and-foot-trauma-injury.jpg?s=612x612&w=0&k=20&c=B0AOTGn_D5h3l3gThiHSJdN9eWF45n66TJyyND3UZ38=",
  },
];

const MedicalServices = () => {
  return (
    <section
      id="medical-services"
      className="py-20 bg-gradient-to-b from-white to-green-50"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* heading same light green style */}
        <h2 className="text-4xl font-extrabold mb-12 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Our Medical Services
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {medicalServices.map((service, index) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
              </div>

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

export default MedicalServices;
