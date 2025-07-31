import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  }

  return (
    <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-2xl px-8 py-10 backdrop-blur-md border border-accent/30 mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 tracking-tight drop-shadow-lg">
          Sign In
        </h1>
        <p className="text-md text-gray-500 mb-4">
          Welcome back! Please enter your credentials to continue.
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <div className="flex justify-center items-center mt-6 text-sm">
        <span className="text-gray-500">Don't have an account?</span>
        <Link
          className="font-semibold text-accent hover:underline transition-colors ml-2"
          to="/auth/register"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default AuthLogin;
