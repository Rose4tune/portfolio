import { useMemo, useState } from "react";

export default function useSearchFilter<
  T extends { title: string; content?: string }
>(items: T[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  return { searchQuery, setSearchQuery, filteredItems };
}
