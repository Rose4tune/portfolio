import { useMemo } from "react";
import useTagFilter from "./useTagFilter";
import useSearchFilter from "./useSearchFilter";

export default function useSearchTagFilterBar<
  T extends {
    title: string;
    content?: string;
    tags?: string[];
  }
>(items: T[], uniqueTags: string[]) {
  const { selectedTag, setSelectedTag, handleTagSelect } =
    useTagFilter(uniqueTags);

  const tagFilteredItems = useMemo(() => {
    return selectedTag
      ? items.filter((item) => item.tags?.includes(selectedTag))
      : items;
  }, [items, selectedTag]);

  const { searchQuery, setSearchQuery, filteredItems } =
    useSearchFilter(tagFilteredItems);

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return uniqueTags;
    const query = searchQuery.toLowerCase().trim();
    return uniqueTags.filter((tag) => tag.toLowerCase().includes(query));
  }, [uniqueTags, searchQuery]);

  return {
    filteredItems,
    selectedTag,
    searchQuery,
    setSelectedTag,
    setSearchQuery,
    handleTagSelect,
    filteredTags,
  };
}
