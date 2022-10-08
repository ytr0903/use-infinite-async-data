export default defineEventHandler(async (event) => {
  const { offset, limit } = useQuery(event);
  const { results } = await $fetch<{
    next: string;
    results: { name: string; url: string }[];
  }>("https://pokeapi.co/api/v2/pokemon/", {
    query: { limit, offset },
  });
  return results.map((val) => {
    const number = Number(`${val.url}`.split("/")?.at(-2));
    return {
      name: val.name,
      url: val.url,
      number: number,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${number}.png`,
    };
  });
});
