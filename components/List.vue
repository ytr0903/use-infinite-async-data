<script lang="ts" setup>
const fetcher = (limit: number, offset: number) =>
  $fetch("/api/pokemon", { query: { limit, offset } });

const {
  data: dataList,
  pending,
  size,
  setSize,
  refresh,
} = useInfiniteAsyncData((index: number) => [10, (index - 1) * 10], fetcher);

const data = computed(() => dataList.value?.flat() ?? null);
const isCompleted = computed(() => data.value.length < size.value * 10);

const fetchMore = () => {
  setSize(size.value + 1);
};
</script>

<template>
  <div class="box">
    <div class="box-card" v-for="(poke, i) in data" :key="i">
      <div class="image">
        <img :alt="poke.name" :src="poke.image" />
      </div>
      <h4 style="margin: 0">{{ poke.number }}. {{ poke.name }}</h4>
    </div>
    <Loader v-if="!pending && !isCompleted" @load="fetchMore" />
  </div>
</template>

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
  aspect-ratio: 1 / 1;
  display: flex;

  img {
    width: 100%;
  }
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
