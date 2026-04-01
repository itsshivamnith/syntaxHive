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

const SignUp = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userRegisterSchema = z.object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(100, { message: "Name must not exceed 100 characters" }),
    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100, { message: "Password must not exceed 100 characters" }),
  });

  type FormData = z.infer<typeof userRegisterSchema>;

  const addUserData = async (newUser: FormData) => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
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
  } = useForm<FormData>({ resolver: zodResolver(userRegisterSchema) });

  const signUpMutation = useMutation({
    mutationFn: (newUser: FormData) => addUserData(newUser),
    onSuccess: () => {
      toast.success("SignUp successfully!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      reset();
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const handleFormSubmit = (data: FormData) => {
    signUpMutation.mutate(data);
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
      <div className="flex items-center gap-3 mr-4">
        <img src="/logo.png" alt="Logo" className="size-20" />
        <h1 className="text-2xl font-bold text-white -ml-8 font-code">
          SyntaxHive
        </h1>
      </div>
      <div className="flex flex-col items-center gap-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 p-8 shadow-lg w-[380px]">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2 text-[var(--hive-purple)]">Sign Up</h1>
          <p className="text-sm text-gray-400 mt-1">
            Hey, enter your details to create a new account!
          </p>
        </div>

        {/* Form */}
        <form
          className="flex w-full flex-col gap-5"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {/* Name */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter Your Name"
              {...register("name")}
              className="focus-visible:ring-main focus-visible:ring-1 text-white"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="example@example.com"
              {...register("email")}
              className="focus-visible:ring-main focus-visible:ring-1 text-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter Password"
              {...register("password")}
              className="focus-visible:ring-main focus-visible:ring-1 text-white"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="mt-3 bg-primary text-white font-semibold hover:bg-[var(--accent-hover)] cursor-pointer hover-scale"
            disabled={signUpMutation.isPending}
          >
            {signUpMutation.isPending ? (
              <>
                <Loader className="fill-black" />
                Signing Up
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        {/* Footer Text */}
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-[var(--hive-purple)] font-medium hover:underline">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
