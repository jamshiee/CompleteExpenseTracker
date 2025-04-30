import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiLoader } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Input from "../../components/ui/input";
import api from "../../libs/apiCall";
import useStore from "../../store/index";

const registerSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(3, "Name is required"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be atleast 8 characters long"),
});

const Signup = () => {
  const { user } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { data: res } = await api.post("/auth/sign-up", data);

      if (res?.user) {
        toast.success("Account creation successfull.");
        setTimeout(() => {
          navigate("/sign-in");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    user && navigate("/");
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full py-10 ">

<div className="flex-col">
      <div className="flex justify-center w-full mb-8">
        <h2 className="  font-bold text-[50px] bg-sky-500 px-3.5 w-40  text-center text-white shadow-sm/80 shadow-sky-600">
          exp.
        </h2>
      </div>


      <Card className="bg-white  shadow-md overflow-hidden w-[400px] ">
        <div className="p-6 md:p-8">
          <CardHeader className="py-0">
            <CardTitle className="text-center mb-5">Create Account</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="mb-8 space-y-6">
                <Input
                  disabled={isSubmitting}
                  id="firstName"
                  label="Name"
                  name="firstName"
                  type="text"
                  placeholder="John Snow"
                  error={errors?.firstName?.message}
                  {...register("firstName")}
                  className="text-sm border "
                />
                <Input
                  disabled={isSubmitting}
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="example@mail.com"
                  error={errors?.email?.message}
                  {...register("email")}
                  className="text-sm border "
                />
                <Input
                  disabled={isSubmitting}
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  placeholder=" ********"
                  error={errors?.password?.message}
                  {...register("password")}
                  className="text-sm border "
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <BiLoader className="text-2xl text-white animate-spin" />
                ) : (
                  "Create an account"
                )}
              </Button>
            </form>
          </CardContent>
        </div>
        <CardFooter className="justify-center gap-2">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link
            to="/sign-in"
            className="text-sm font-semibold text-sky-600 hover:underline"
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default Signup;
