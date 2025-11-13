import MainHome from "@/components/home/MainHome";
import { redirect } from "next/navigation";
import { auth } from "./auth";

const Home = async () => {
  const session = await auth();
  
  if (session && session.user) {
    redirect("/profile");
  }

  return (
    <div>
      <MainHome />
    </div>
  );
};

export default Home;
