"use client";

import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const loadPortal = async () => {
    const response = await fetch("/api/portal");
    const data = await response.json();
    router.push(data.url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      {!isLoading && (
        <>
          <p className="mb-6">
            {user?.is_subscribed
              ? `Subscribed: ${user.interval}`
              : "Not subscribed"}
          </p>
          <button onClick={loadPortal}>Manage Subscrption</button>
        </>
      )}
    </div>
  );
}
