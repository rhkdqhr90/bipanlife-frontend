// src/lib/oauth/startOAuth.ts
type Provider = "google" | "kakao" | "naver";
type Intent = "login" | "signup";

function base64url(str: string) {
  // 유니코드 안전 btoa + URL-safe
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function buildState(redirectUri: string, intent: Intent) {
  return base64url(JSON.stringify({ redirectUri, intent }));
}

export function startOAuth(provider: Provider, intent: Intent) {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const backend =
    (env && env.replace(/\/$/, "")) ||
    (typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:8080");

  const sp = new URLSearchParams(window.location.search);
  let redirectUri = sp.get("redirectUri") ?? window.location.pathname;
  console.log(redirectUri);
  if (redirectUri.startsWith("/login") || redirectUri.startsWith("/signup")) {
    redirectUri = "/"; // 루프 방지
  }

  const state = buildState(redirectUri, intent);
  window.location.href = `${backend}/auth/set-redirect?provider=${provider}&state=${encodeURIComponent(state)}`;
}
