import type { AsyncData } from "nuxt/dist/app";
import type {
  AsyncDataOptions,
  KeyOfRes,
  PickFrom,
  _Transform,
} from "nuxt/dist/app/composables/asyncData";
import type { Ref } from "vue";

type ArgumentsTuple = [...any[]];

type InfiniteAsyncDataFetcher<DataT, ParamT extends ArgumentsTuple> = (
  ...args: ParamT
) => Promise<DataT>;

type InfiniteAsyncDataKeyLoader<DataT, ParamT extends ArgumentsTuple> = (
  index: number,
  previousPageData: DataT | null
) => [...Parameters<InfiniteAsyncDataFetcher<DataT, ParamT>>];

/** configuration */
interface InfiniteAsyncDataOptions<
  DataT = any,
  Transform extends _Transform<DataT, any> = _Transform<DataT, DataT>,
  PickKeys extends KeyOfRes<_Transform> = KeyOfRes<Transform>
> extends AsyncDataOptions<DataT, Transform, PickKeys> {
  initialSize?: number;
  // revalidateAll?: boolean
  // persistSize?: boolean
  // revalidateFirstPage?: boolean
  // fetcher?: InfiniteAsyncDataFetcher<DataT>
}

/** response */
interface InfiniteAsyncData<DataT = any, DataE = Error>
  extends AsyncData<DataT[], DataE> {
  size: Readonly<Ref<number>>;
  setSize: (
    size: number | ((size: number) => number)
  ) => Promise<DataT[] | null>;
}

export const useInfiniteAsyncData = <
  ParamT extends ArgumentsTuple,
  DataT,
  DataE = Error,
  Transform extends _Transform<DataT> = _Transform<DataT, DataT>,
  PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>
>(
  getKey: InfiniteAsyncDataKeyLoader<
    PickFrom<ReturnType<Transform>, PickKeys>,
    ParamT
  >,
  fetcher: InfiniteAsyncDataFetcher<DataT, ParamT>,
  options: InfiniteAsyncDataOptions<DataT, Transform, PickKeys> = {
    initialSize: 1,
  }
): InfiniteAsyncData<
  PickFrom<ReturnType<Transform>, PickKeys>,
  DataE | true | null
> => {
  const size = ref(options.initialSize ?? 1);
  const setSize = async (arg: number | ((size: number) => number)) => {
    size.value = typeof arg === "number" ? arg : arg(size.value);
    await _refresh();
    return dataList.value;
  };

  const dataList = useState<PickFrom<ReturnType<Transform>, PickKeys>[]>();

  const {
    data,
    pending,
    refresh: _refresh,
    execute,
    error,
  } = useAsyncData<DataT, DataE, Transform, PickKeys>(() => {
    return fetcher(...getKey(size.value, dataList.value?.at(-1) ?? null));
  }, options);

  const refresh = async () => {
    dataList.value = [];
    await setSize(1);
  };

  watch(
    () => data.value,
    (val) => {
      if (!dataList.value) dataList.value = [];
      if (val) dataList.value[size.value - 1] = val;
    },
    { immediate: true }
  );

  const asyncData = {
    data: dataList,
    pending,
    refresh,
    execute,
    error,
    size: readonly(size),
    setSize,
  };
  const asyncDataPromise = Promise.resolve().then(() => asyncData);
  return { ...asyncData, ...asyncDataPromise };
};
