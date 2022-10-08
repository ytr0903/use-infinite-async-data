export const usePokemonList = () => {
  const {
    data: dataList,
    pending,
    size,
    setSize,
  } = useInfiniteAsyncData(
    (index: number) => [10, (index - 1) * 10],
    (limit: number, offset: number) =>
      $fetch("/api/pokemon", { query: { limit, offset } })
  );

  const data = computed(() => dataList.value?.flat() ?? null);
  const isCompleted = computed(() => data.value.length < size.value * 10);

  const fetchMore = () => {
    setSize(size.value + 1);
  };
  return {
    data,
    pending,
    isCompleted,
    fetchMore,
  };
};
