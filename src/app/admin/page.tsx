"use client";

import Styles from "@/styles/api.module.css";
import Heading from "@/components/Heading/Heading";
import bstyle from "@/components/Button/Button.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: user, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Login failed");
        return;
      }

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
          <label htmlFor="user">User: </label>
          <input
            className="input"
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter your username"
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
