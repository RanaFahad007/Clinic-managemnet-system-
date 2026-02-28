 import React from "react";

function Footer() {
  return (
    <footer className="bg-green-600 text-white text-center py-6 mt-12">
      <p>&copy; {new Date().getFullYear()} MyClinic. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
