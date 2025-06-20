"use client";

import { useState, useEffect } from "react";
import ProfileSection from "./ProfileSection";
import React from "react";

export default function HomePage() {
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (!response.ok) throw new Error("Failed to fetch tags");
        const tags = await response.json();
        setUniqueTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  return (
    <div className="space-y-8">
      <ProfileSection uniqueTags={uniqueTags} />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
        <ul>
          <li>Senior Software Engineer at Tech Company</li>
          <li>Full Stack Developer at Startup</li>
          <li>Freelance Web Developer</li>
        </ul>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Education</h2>
        <ul>
          <li>Bachelor&apos;s Degree in Computer Science</li>
          <li>Various online certifications and courses</li>
        </ul>
      </div>
    </div>
  );
}
