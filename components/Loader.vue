<template>
  <div ref="target" />
</template>

<script lang="ts" setup>
const target = ref(null);
const targetIsVisible = useElementVisibility(target);
const emits = defineEmits(["load"]);
watchEffect(() => {
  if (targetIsVisible.value) emits("load");
});
</script>
