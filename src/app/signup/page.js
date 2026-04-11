"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ToTitleCase from "../components/ToTitleCase";
export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);
  const handleSignUp = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { status, message } = await res.json();
    alert(message);
    if (status == 201) {
      setName("");
      setEmail("");
      setPassword("");

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    }
  };

  return (
    <>
      <title>Sign Up</title>

      <div>Login</div>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(ToTitleCase(e.target.value))}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input type="submit" value="Signup" />
        <p>
          Have an account?<Link href={"/login"}>Login</Link>
        </p>
      </form>
    </>
  );
}
