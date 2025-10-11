"use client";

import Link from "next/link";
import React from "react";

function ErrorPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-32">
        <h1>ERROR</h1>
        <p className="body1 text-gray-400 mt-4 mb-10">
          예상치 못한 오류가 발생했어요!
        </p>
        <Link
          href="/"
          className="flex items-center justify-center rounded-full bg-black text-white h-12 px-8"
        >
          <span>메인으로 돌아가기</span>
        </Link>
      </div>
    </>
  );
}

export default ErrorPage;
