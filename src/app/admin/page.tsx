"use client";

import Styles from "@/styles/api.module.css";
import Heading from "@/components/Heading/Heading";
import bstyle from "@/components/Button/Button.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!user.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: user,
        password,
      });

      if (loginError || !data.session) {
        setError(loginError?.message || "Login failed");
        return;
      }

      await fetch("/api/set-cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }),
      });

      setError("");
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to login.");
    }
  };

  return (
    <div className={Styles.login}>
      <Heading text="Login" />

      <form onSubmit={handleLogin}>
        <div className={Styles.field}>
          <label htmlFor="user">Email: </label>
          <input
            className="input"
            type="email"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className={Styles.field}>
          <label htmlFor="password">Password: </label>
          <input
            className="input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className={Styles.error}>{error}</p>}

        <button type="submit" className={bstyle.button}>
          Login
        </button>
      </form>
    </div>
  );
}
