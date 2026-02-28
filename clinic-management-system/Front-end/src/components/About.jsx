import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section
      id="about"
      className="pt-28 pb-16 bg-gradient-to-b from-green-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-10 lg:px-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        
        {/* 🩺 Left Side — Text */}
        <motion.div
          className="lg:w-1/2 text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              About Our Clinic
            </h2>

            <p className="text-gray-700 text-base leading-relaxed">
              Welcome to <span className="font-semibold text-green-600">MyClinic</span>,
              where compassionate care meets medical excellence.  
              We’re dedicated to providing high-quality healthcare services that
              combine modern medical science with personalized attention.
            </p>

            <p className="text-gray-700 text-base leading-relaxed">
              Our experienced team offers preventive checkups, diagnostic care,
              and tailored treatment plans — all delivered with warmth and
              empathy in a comfortable environment.
            </p>

            <p className="text-gray-700 text-base leading-relaxed mb-6">
              With state-of-the-art facilities and a focus on patient satisfaction,
              we aim to make every visit positive, efficient, and reassuring.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-sm transition duration-300"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* 🏥 Right Side — Image */}
        <motion.div
          className="lg:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-[80%] lg:w-[80%]">
            <img
              src="https://thumbs.dreamstime.com/b/medical-team-doctors-nurses-illustration-healthcare-professionals-hospital-staff-clinic-workers-cartoon-style-medical-team-doctors-404921536.jpg"
              alt="Clinic"
              className="rounded-2xl shadow-md object-cover h-[280px] lg:h-[320px] w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent rounded-2xl"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
