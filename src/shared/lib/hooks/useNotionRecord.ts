import { ExtendedRecordMap } from "notion-types";
import { useEffect, useState } from "react";

export default function useNotionRecord(serializedRecordMap: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);

  useEffect(() => {
    try {
      if (serializedRecordMap) {
        const parsedRecordMap = JSON.parse(
          serializedRecordMap
        ) as ExtendedRecordMap;
        setRecordMap(parsedRecordMap);
      } else {
        setError(new Error("서버에서 데이터를 가져오지 못했습니다."));
      }
    } catch (e) {
      console.error("Failed to parse recordMap:", e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [serializedRecordMap]);

  return { recordMap, loading, error, setLoading, setError };
}
