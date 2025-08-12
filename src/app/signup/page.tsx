"use client";

import { apiFetch } from "@/lib/apis/apiFetch";
import { startOAuth } from "@/lib/apis/startOAuth";
import React, { useEffect, useState } from "react";

const OAuth2SignUpPage = () => {
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const isAgreed = agreeTerms && agreePrivacy && agreeAll;

  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setprivacyContent] = useState("");

  useEffect(() => {
    const fetchTerms = async () => {
      const res = await apiFetch(`/api/terms`);
      if (res.ok) {
        const data = await res.json();
        setTermsContent(data.content); // HTML or Text
      }
    };
    const fetchPrivacy = async () => {
      const res = await apiFetch(`/api/privacy`);
      if (res.ok) {
        const data = await res.json();
        setprivacyContent(data.content); // HTML or Text
      }
    };
    fetchTerms();
    fetchPrivacy();
  }, []);

  useEffect(() => {
    setAgreeAll(agreeTerms && agreePrivacy);
  }, [agreeTerms, agreePrivacy]);

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  const oauthLogin = (provider: "google" | "kakao" | "naver") => {
    if (!isAgreed) {
      alert("약관에 동의 하셔야 가입이 가능합니다");
      return; // ❌ 미동의 시 차단
    }
    startOAuth(provider, "signup");
  };

  return (
    <div className="text-center max-w-2xl mx-auto mt-20 p-6">
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">소셜 계정으로 시작하기</h1>

        <div className="space-y-4">
          <button
            onClick={() => oauthLogin("naver")}
            className="w-full py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-600"
          >
            네이버로 시작하기
          </button>

          {/* <button
            onClick={() => oauthLogin("kakao")}
            className="w-full py-2 rounded bg-yellow-300 text-black font-semibold hover:bg-yellow-400"
          >
            카카오로 시작하기
          </button> */}

          <button
            onClick={() => oauthLogin("google")}
            className="w-full py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
          >
            구글로 시작하기
          </button>
        </div>
      </div>
      {/* 모두 동의 */}
      <div className="mt-10 flex items-center gap-2 justify-start">
        <input
          type="checkbox"
          id="agreeAll"
          checked={agreeAll}
          onChange={e => handleAgreeAll(e.target.checked)}
        />
        <label htmlFor="agreeAll" className="font-semibold text-sm">
          약관 및 개인정보처리방침 모두 동의
        </label>
      </div>

      {/* 이용약관 */}
      <div className="mt-4 text-left">
        <p className="text-sm font-medium mb-1">[이용약관]</p>
        <textarea
          className="w-full h-32 p-4 border rounded resize-none overflow-y-auto text-sm bg-gray-50"
          readOnly
          value={termsContent}
        />
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={e => setAgreeTerms(e.target.checked)}
          />
          <label className="text-sm">이용약관에 동의합니다.</label>
        </div>
      </div>

      {/* 개인정보처리방침 */}
      <div className="mt-4 text-left">
        <p className="text-sm font-medium mb-1">[개인정보처리방침]</p>
        <textarea
          className="w-full h-32 p-4 border rounded resize-none overflow-y-auto text-sm bg-gray-50"
          readOnly
          value={privacyContent}
        />
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={e => setAgreePrivacy(e.target.checked)}
          />
          <label className="text-sm">개인정보처리방침에 동의합니다.</label>
        </div>
      </div>
    </div>
  );
};

export default OAuth2SignUpPage;
