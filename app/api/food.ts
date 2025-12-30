const BASE_URL =
  "http://localhost:5001/campuscraves-c64f1/us-central1";

export interface Food {
  food_id: string;
  food_name: string;
  food_type: "Brand" | "Generic";
  brand_name?: string;
  food_description?: string;
}

export interface FoodResponse {
  foods: {
    food: Food[];
    total_results: string;
    page_number: string;
  };
}

export async function searchFood(
  query: string,
  page: number,
  pageSize = 20
): Promise<{ foods: Food[]; total: number }> {
  const res = await fetch(
    `${BASE_URL}/foodSearch?q=${encodeURIComponent(
      query
    )}&page=${page}&pageSize=${pageSize}`
  );

  const data: FoodResponse = await res.json();

  const foods = Array.isArray(data.foods.food)
    ? data.foods.food
    : [data.foods.food];

  return {
    foods,
    total: Number(data.foods.total_results),
  };
}
