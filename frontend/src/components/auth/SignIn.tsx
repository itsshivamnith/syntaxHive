import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useUser } from "@/api/useUser";
import Loader from "../ui/loader";

const SignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userLoginSchema = z.object({
    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100, { message: "Password must not exceed 100 characters" }),
  });

  type FormData = z.infer<typeof userLoginSchema>;

  const loginUserData = async (userData: FormData) => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/signin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      }
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to register user");
    }

    return data;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(userLoginSchema) });

  const loginMutation = useMutation({
    mutationFn: (userData: FormData) => loginUserData(userData),
    onSuccess: () => {
      toast.success("Signin Succesfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      reset();
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const handleFormSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  const { data, isLoading } = useUser();

  if (isLoading)
    return (
      <div>
        <Loader className="mt-96 size-20 fill-[var(--hive-purple)]" />
      </div>
    );

  if (data) return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen w-screen items-center justify-center flex-col">
      {/* Logo + Brand */}
      <div className="flex items-center gap-3 mr-4">
        <img src="/logo.png" alt="Logo" className="size-20" />
        <h1 className="text-2xl font-bold text-white -ml-8 font-code">
          SyntaxHive
        </h1>
      </div>

      {/* Form Block */}
      <div className="flex flex-col items-center gap-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 p-8 shadow-lg w-[380px]">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2 text-[var(--hive-purple)]">Sign In</h1>
          <p className="text-sm text-gray-400 mt-1">
            Welcome back! Please enter your details to login.
          </p>
        </div>

        {/* Form */}
        <form
          className="flex w-full flex-col gap-5"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="example@example.com"
              className="focus-visible:ring-main focus-visible:ring-1 text-white"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter Password"
              className="focus-visible:ring-main focus-visible:ring-1 text-white"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-3 bg-primary text-white font-semibold hover:bg-[var(--accent-hover)] cursor-pointer hover-scale"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader className="fill-black" />
                Signing In
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Try Demo Account */}
        <Button className="w-full bg-transparent border border-white hover:bg-white hover:text-black cursor-pointer" 
        onClick={()=> {
          loginMutation.mutate({email: 'test@test.com', password: 'test123456'})
        }}
        >
          Try Demo Account
        </Button>

        {/* Footer */}
        <p className="text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[var(--hive-purple)] font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
