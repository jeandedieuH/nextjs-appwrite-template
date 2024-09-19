import UpdateProfileForm from "@/components/update-profile-form";
import { getUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your profile",
};

const ProfilePage = async () => {
  const user = await getUser();

  if (!user) return redirect("/login");
  return (
    <div>
      <UpdateProfileForm user={user} />
    </div>
  );
};

export default ProfilePage;
