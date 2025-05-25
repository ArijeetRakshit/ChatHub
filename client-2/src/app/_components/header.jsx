"use client";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isChatPage = pathname === "/chat";

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_BE_URL}:${process.env.NEXT_PUBLIC_AUTH_BE_PORT}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logged out");
      router.push("/"); // Redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="top-0 w-full z-50 bg-blue-600 text-white py-4 px-6 flex justify-center sticky items-center">
      <h1 className="text-2xl font-bold">ChatHub</h1>
      {isChatPage && (
        <button
          onClick={handleLogout}
          className="absolute right-6 bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
        >
          Logout
        </button>
      )}
    </header>
  );
}
