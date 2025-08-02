"use client";

import { AnimatePresence } from "framer-motion";
import TransitionWrapper from "@/components/TransitionWrapper";

export default function AnimatedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <AnimatePresence mode="wait">
      <TransitionWrapper>{children}</TransitionWrapper>
    </AnimatePresence>
  );
}
