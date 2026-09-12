import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  /** 加载更多的回调函数 */
  fetchMore: () => Promise<void>;
  /** 是否还有更多数据 */
  hasMore: boolean;
  /** 是否正在加载（首次或刷新） */
  loading: boolean;
  /** 距离底部多少像素时触发加载，默认 100 */
  threshold?: number;
  /** 防抖时间（毫秒），默认 200 */
  debounceMs?: number;
}

interface UseInfiniteScrollReturn {
  /** 用于 IntersectionObserver 的 ref */
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  /** 是否正在加载更多 */
  loadingMore: boolean;
  /** 手动触发加载更多 */
  loadMore: () => void;
}

/**
 * 无限滚动 Hook
 * 使用 IntersectionObserver 监听底部元素，自动触发加载更多
 */
export function useInfiniteScroll({
  fetchMore,
  hasMore,
  loading,
  threshold = 100,
  debounceMs = 200,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchMoreRef = useRef(fetchMore);

  // 保持 fetchMore 引用最新
  useEffect(() => {
    fetchMoreRef.current = fetchMore;
  }, [fetchMore]);

  // 加载更多函数
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return;

    setLoadingMore(true);
    try {
      await fetchMoreRef.current();
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, loading]);

  // 防抖处理
  const debouncedLoadMore = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      loadMore();
    }, debounceMs);
  }, [loadMore, debounceMs]);

  // 设置 IntersectionObserver
  useEffect(() => {
    // 清理之前的 observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 如果没有更多数据或正在加载，不设置 observer
    if (!hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          debouncedLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    const currentObserver = observerRef.current;
    const currentRef = loadMoreRef.current;

    if (currentRef) {
      currentObserver.observe(currentRef);
    }

    return () => {
      currentObserver.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasMore, loading, threshold, debouncedLoadMore]);

  return {
    loadMoreRef,
    loadingMore,
    loadMore,
  };
}