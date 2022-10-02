<template>
  <div>
    <div class="header">
      <h1>useInfiniteAsyncData</h1>
      <p>
        <code>useAsyncData()</code> にページネーション機能を追加した
        <code>useInfiniteAsyncData()</code> のデモページです。
      </p>
    </div>
    <div class="box">
      <div class="box-card" v-for="(poke, i) in data" :key="i">
        <img :alt="poke.name" :src="getImagePath(poke.number)" class="image" />
        <h4 style="margin: 0">{{ poke.number }}. {{ poke.name }}</h4>
      </div>
      <template v-if="pending">
        <div class="box-card" v-for="i in 10">
          <div class="skelton"></div>
          <h4 style="margin: 0">Now Loading...</h4>
        </div>
      </template>
      <Loader v-if="!pending && !isCompleted" @load="setSize(size + 1)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const {
  data: dataList,
  pending,
  size,
  setSize,
} = useInfiniteAsyncData(
  (i: number) => [i],
  (i: number) => {
    return $fetch<{
      next: string;
      results: { name: string; url: string }[];
    }>("https://pokeapi.co/api/v2/pokemon/", {
      query: { limit: 10, offset: (i - 1) * 10 },
    });
  },
  {
    transform: (res) => {
      return res.results.map((val) => ({
        name: val.name,
        url: val.url,
        number: Number(`${val.url}`.split("/")?.at(-2)),
      }));
    },
  }
);

const data = computed(() => dataList.value?.flat() ?? null);
const isCompleted = computed(() => data.value.length < size.value * 10);

const getImagePath = (i: number) => {
  return `node_modules/pokemon.json/images/${`${i}`.padStart(3, "0")}.png`;
};
</script>

<style lang="scss" scoped>
.box {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.box-card {
  padding: 8px;
  background: #b3f1ff;
}

.image {
  width: 100%;
}

@keyframes skelton {
  0% {
    background: #ccc;
  }
  100% {
    background: #ddd;
  }
}
.skelton {
  display: inline-block;
  width: 100%;
  aspect-ratio: 1 / 1;
  animation: skelton 0.8s ease 0s infinite alternate;
}
</style>
