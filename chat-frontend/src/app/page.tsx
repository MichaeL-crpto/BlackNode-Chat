import { redirect } from "next/navigation";

import { AuthPage } from "@/components/ui/auth-page";

export default async function Home() {
  return <AuthPage />;
}
