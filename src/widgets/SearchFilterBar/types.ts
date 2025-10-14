export interface TagButtonProps {
  tag: string | null;
  selectedTag: string | null;
  onClick: () => void;
}

export interface TagFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface SearchFilterBarProps {
  title?: string;
  className?: string;
  selectedTag: string | null;
  searchQuery: string;
  filteredTags: string[];
  onTagSelect: (tag: string | null) => void;
  onSearchChange: (query: string) => void;
}
