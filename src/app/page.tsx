import { redirect } from "next/navigation";
import { getHomeRedirectTarget } from "@/server/queries";

export default async function Home() {
  redirect(await getHomeRedirectTarget());
}
