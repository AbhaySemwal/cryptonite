import Header from "@/components/Header";
import HomeContent from "@/components/HomeContent";
import Image from "next/image";

export default function Home() {
  return (
    <main className="text-white">
      <Header/>
      <HomeContent/>
    </main>
  );
}
