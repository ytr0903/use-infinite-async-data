<template>
  <div>
    <h1>useInfiniteAsyncData</h1>
    <p>
      <code>useAsyncData()</code> にページネーション機能を追加した
      <code>useInfiniteAsyncData()</code> のデモページです。
    </p>
  </div>
  <div class="box">
    <template v-if="data">
      <template v-for="(poke, i) in data">
        <div class="box-card">
          <img
            :alt="poke.name"
            :src="getImagePath(poke.number)"
            class="image"
          />
          <h4 style="margin: 0">{{ poke.number }}. {{ poke.name }}</h4>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
const { data, pending } = useAsyncData(
  () => {
    return $fetch<{
      results: { name: string; url: string }[];
    }>("https://pokeapi.co/api/v2/pokemon/", {
      query: { limit: 10, offset: 0 },
    });
  },
  {
    transform: ({ results }) => {
      return results.map((val) => ({
        name: val.name,
        url: val.url,
        number: Number(`${val.url}`.split("/")?.at(-2)),
      }));
    },
  }
);

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
</style>
