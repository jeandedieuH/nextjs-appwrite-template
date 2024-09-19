"use client";
import React, { useState } from "react";

import { IconBrandGoogle } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";
import { userSchema } from "@/schemas/userSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { ArrowRight, Loader2 } from "lucide-react";

import { PhoneInput } from "@/components/ui/phone-input";

import { login, register } from "@/lib/actions/user.actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";

type Props = {
  title: string;
  description: string;
  buttonText: string;
  type: "signUp" | "login";
  footerText?: string;
};
export function UserForm({
  title,
  description,
  buttonText,
  type,
  footerText,
}: Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = userSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (values: z.input<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (type === "signUp") {
        const userData = {
          email: values.email,
          password: values.password,
          firstName: values.firstName!,
          lastName: values.lastName!,
          phone: values.phone!,
        };

        await register(userData);

        router.push("/");
        toast.success("Account created successfully");
      }

      if (type === "login") {
        const response = await login({
          email: values.email,
          password: values.password,
        });
        if (response) router.push("/");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <div className="flex flex-col items-center">
        <Logo />
        <h2 className="text-20 font-bold text-primary-600">{title}</h2>
        <FormDescription className="text-14 mt-2 max-w-sm text-center text-text-800">
          {description}
        </FormDescription>
      </div>

      <form className="my-8" onSubmit={form.handleSubmit(handleSubmit)}>
        {type === "signUp" && (
          <div>
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="firstName">First name</Label>
                      <FormControl>
                        <Input id="firstName" type="text" {...field} />
                      </FormControl>
                    </LabelInputContainer>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="lastName">Last name</Label>
                      <FormControl>
                        <Input id="lastName" type="text" {...field} />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start mb-4">
                  <FormLabel className="text-left">Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput placeholder="eg. 7812345678" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email</Label>
                <FormControl>
                  <Input id="email" type="email" {...field} />
                </FormControl>
              </LabelInputContainer>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <FormControl>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    {...field}
                  />
                </FormControl>
              </LabelInputContainer>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          className="pl-32 block bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600  dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex gap-x-2 items-center ">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            <div className="flex gap-x-2 items-center">
              <span>{buttonText}</span>
              <ArrowRight className="ml-2 h-6 w-6" />
            </div>
          )}
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <button
            className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-14 text-text-900">Google</span>
            <BottomGradient />
          </button>
        </div>
        <div className="my-8">
          <p className="text-14 font-medium text-text-800">
            {footerText}{" "}
            {type === "signUp" ? (
              <Link href="/login" className="underline hover:text-blue-500">
                Login
              </Link>
            ) : (
              <Link href="/register" className="underline hover:text-blue-500">
                Register
              </Link>
            )}
          </p>
        </div>
      </form>
    </Form>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
