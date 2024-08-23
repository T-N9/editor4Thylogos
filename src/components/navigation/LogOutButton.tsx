// components/LogoutButton.tsx
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import Cookies from "js-cookie";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('authToken');
      router.push('/log-in');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
    >
      Log Out
    </Button>
  );
}
