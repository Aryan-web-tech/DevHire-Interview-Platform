import { useContext} from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { AuthContext } from "../context/authContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Hero />
      <Features role={user?.role || "candidate"} />
      <Footer />
    </>
  );
}
