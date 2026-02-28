import React from "react";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        
        {/* 🌿 Main Contact Container */}
        <motion.div
          className="flex flex-col lg:flex-row items-center bg-green-50/60 rounded-3xl shadow-md overflow-hidden border border-green-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* 🖼 Left Image */}
          <motion.div
            className="flex-col lg:w-1/2 w-full flex justify-center bg-white"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="https://finnovating.com/wp-content/uploads/2021/01/contact-us-03.png"
              alt="Contact"
              className="object-cover w-full h-[340px] lg:h-[380px] rounded-l-3xl"
            />
          </motion.div>

          {/* 📩 Right Form */}
          <motion.div
            className="lg:w-1/2 w-full px-8 py-10 bg-white/80 backdrop-blur-sm"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold text-green-500 mb-6">
              Contact <span className="text-green-500">Us</span>
            </h2>

            <form className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter a valid email address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows="3"
                  placeholder="Write your message"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 bg-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="accent-green-500" />
                <p className="text-sm text-gray-600">
                  I accept the{" "}
                  <a href="#" className="text-green-500 underline">
                    Terms of Service
                  </a>
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-300"
              >
                SUBMIT
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* 📍 Info Boxes
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          {[
            {
              title: "📞 CALL US",
              lines: ["+92183464436", "+923252796534"],
            },
            {
              title: "📍 LOCATION",
              lines: ["Building Number 51, Street Number 12, Model Town Extension, Lahore, Punjab, Pakistan"],
            },
            {
              title: "🕒 HOURS",
              lines: ["Mon–Fri: 11am–8pm", "Sat–Sun: 6am–8pm"],
            },
          ].map((box, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" }}
              className="bg-green-500 p-5 rounded-xl text-center transition duration-300"
            >
              <h3 className="font-bold text-lg mb-1">{box.title}</h3>
              {box.lines.map((line, i) => (
                <p key={i} className="text-sm">
                  {line}
                </p>
              ))}
            </motion.div>
          ))}
        </motion.div> */}

       
      </div>
    </section>
  );
};

export default Contact;
