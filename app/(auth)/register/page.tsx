import { UserForm } from "../_components/userForm";

export const metadata = {
  title: "Register to your account",
};
const SignUp = () => {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat pt-16"
      style={{ backgroundImage: `url("/assets/images/auth-image.jpg")` }}
    >
      <div className="mx-auto w-full max-w-md rounded-xl bg-background p-4 shadow-lg md:p-8 lg:rounded-3xl">
        <UserForm
          type="signUp"
          title="Welcome to our platform!"
          description="Please register to continue."
          buttonText="Register"
          footerText="Already have an account?"
        />
      </div>
    </div>
  );
};

export default SignUp;
