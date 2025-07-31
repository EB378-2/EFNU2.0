"use client";

import React from "react";
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { authProviderClient } from "@/providers/auth-provider/auth-provider.client";

export const GoogleSignUpButton = () => {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error("Google Client ID is not set");
    return null;
  }

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;

    if (!credential) {
      console.log("Google authentication failed");
      return;
    }

    try {
      const { success, error } = await authProviderClient.signUpWithGoogle?.({ 
        credential 
      }) ?? {};

      if (!success) {
        throw error ?? new Error("Sign up failed");
      }

      console.log("Signed up successfully!");
      router.push("/home");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      console.log("Failed to sign up with Google");
    }
  };

  const handleGoogleFailure = () => {
    console.log("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
        text="signup_with"
        width="100%"
        useOneTap
        auto_select
        theme="filled_blue"
        shape="rectangular"
        size="large"
      />
    </GoogleOAuthProvider>
  );
};