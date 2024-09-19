import { UserForm } from "../_components/userForm";

export const metadata = {
  title: "Login to your account",
};
const Login = () => {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat pt-16"
      style={{ backgroundImage: `url("/assets/images/auth-image.jpg")` }}
    >
      <div className="mx-auto w-full max-w-md rounded-xl bg-background p-4 shadow-lg md:p-8 lg:rounded-3xl">
        <UserForm
          type="login"
          title="We're glad you're here!"
          description="Please sign in to continue"
          buttonText="Sign in"
          footerText="Don't have an account?"
        />
      </div>
    </div>
  );
};

export default Login;
