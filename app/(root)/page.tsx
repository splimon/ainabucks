import MainHome from "@/components/home/MainHome";
import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";

const Home = async () => {
  const result = await db.select().from(usersTable);
  // console.log(JSON.stringify(result, null, 2)); // DEBUGGING: Check if data is fetched correctly

  return <MainHome />;
};

export default Home;
