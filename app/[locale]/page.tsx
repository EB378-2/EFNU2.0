"use client";



import { NavigateToResource } from "@refinedev/nextjs-router";
import { Authenticated } from "@refinedev/core";
import React from "react";

export default function IndexPage() {

  return (
    <Authenticated key="home">
        <NavigateToResource />
    </Authenticated>
  )
}