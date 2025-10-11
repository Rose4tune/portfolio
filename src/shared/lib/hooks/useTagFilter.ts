import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useTagFilter(uniqueTags: string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    try {
      const tagParam = searchParams.get("tag");
      if (tagParam && uniqueTags.includes(tagParam)) {
        setSelectedTag(tagParam);
      } else {
        setSelectedTag(null);
      }
    } catch (error) {
      console.error("Error setting tag:", error);
      setSelectedTag(null);
    }
  }, [searchParams, uniqueTags]);

  const handleTagSelect = useCallback(
    (tag: string | null) => {
      try {
        setSelectedTag(tag);
        const params = new URLSearchParams(searchParams.toString());
        if (tag && uniqueTags.includes(tag)) {
          params.set("tag", tag);
        } else {
          params.delete("tag");
        }
        router.replace(`${pathname}?${params.toString()}`);
      } catch (error) {
        console.error("Error handling tag selection:", error);
        setSelectedTag(null);
      }
    },
    [router, pathname, searchParams, uniqueTags]
  );

  return { selectedTag, setSelectedTag, handleTagSelect };
}
