import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logoutAccount } from "@/lib/actions/user.actions";

import { Layout, List, LogOut, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const UserButton = ({ user }: UserInfoProps) => {
  if (!user) return null;

  const handleLogout = async () => {
    await logoutAccount();
    toast.success("Logged out successfully");
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex gap-x-2 items-center ml-3 lg:ml-5 mr-10 lg:mr-16 cursor-pointer">
          <Avatar>
            <AvatarImage
              src={user?.avatarUrl}
              alt={user?.username}
              className="w-9 h-9 rounded-full"
            />
            <AvatarFallback>PL</AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit px-5" align="end">
        <div className="flex flex-col gap-x-1 mb-3">
          <p className="text-sm font-medium leading-none">{user?.username}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div className="flex flex-col items-start space-y-3 ">
          {(user?.role === "student" || user?.role === "user") && (
            <Link
              href="/instructor/request"
              className="text-white transition-colors duration-500 rounded-sm py-1 px-3 bg-secondary hover:bg-secondary/80"
            >
              Become an instructor
            </Link>
          )}
          <div className="flex gap-x-2 items-center hover:text-secondary">
            <User className="h-4 w-4" />
            <Link href={`/profile/${user?.userId}`} className="text-sm">
              My profile
            </Link>
          </div>

          <div className="">
            {user?.role === "admin" && (
              <div className="flex flex-col gap-y-3">
                <Link
                  href="/admin/dashboard"
                  className="flex gap-x-2 items-center hover:text-secondary"
                >
                  <Layout className="h-4 w-4" />
                  <p className="text-sm">Admin Dashboard</p>
                </Link>
                <Link
                  href="/instructor/dashboard"
                  className="flex gap-x-2 items-center hover:text-secondary"
                >
                  <Layout className="h-4 w-4" />
                  <p className="text-sm">Instructor Dashboard</p>
                </Link>
              </div>
            )}

            {user?.role === "instructor" && (
              <Link
                href="/instructor/dashboard"
                className="flex gap-x-2 items-center hover:text-secondary"
              >
                <List className="h-4 w-4" />
                <p className="text-sm">Dashboard</p>
              </Link>
            )}
            {user?.role === "student" && (
              <Link
                href="/student/dashboard"
                className="flex gap-x-2 items-center hover:text-secondary"
              >
                <Layout className="h-4 w-4" />
                <p className="text-sm">Dashboard</p>
              </Link>
            )}
          </div>

          <div className="flex gap-x-2 items-center">
            <LogOut className="h-4 w-4" />
            <Button
              onClick={handleLogout}
              variant="link"
              className="pl-0 text-slate-900 text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserButton;
