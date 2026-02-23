"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { publicConfig } from "@/lib/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-primary/5 to-white px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-card-hover"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-black text-brand-textDark">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage {publicConfig.businessName}.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}
