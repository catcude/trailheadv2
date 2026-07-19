import { afterEach, describe, expect, it } from "vitest";
import { isProtectedPath } from "@/lib/supabase/routes";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/config";

describe("isProtectedPath", () => {
  it("protects every (app) surface", () => {
    for (const path of [
      "/dashboard",
      "/checkin",
      "/checkin/session",
      "/community",
      "/settings",
      "/onboarding",
    ]) {
      expect(isProtectedPath(path)).toBe(true);
    }
  });

  it("leaves public surfaces open", () => {
    for (const path of [
      "/",
      "/about",
      "/pricing",
      "/auth/sign-in",
      "/auth/callback",
    ]) {
      expect(isProtectedPath(path)).toBe(false);
    }
  });

  it("does not over-match prefix lookalikes", () => {
    expect(isProtectedPath("/dashboard-tour")).toBe(false);
    expect(isProtectedPath("/settingsy")).toBe(false);
  });
});

describe("supabase config guard", () => {
  const saved = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = saved.url;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = saved.key;
  });

  it("reports unconfigured when either var is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(isSupabaseConfigured()).toBe(false);
    expect(getSupabaseEnv()).toBeNull();
  });

  it("returns the pair when both are present", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(getSupabaseEnv()).toEqual({
      url: "https://example.supabase.co",
      anonKey: "anon",
    });
  });
});
