import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { searchFood, Food } from "../api/food";
import { useRouter } from "expo-router";

const PAGE_SIZE = 10; // MUST be 10 for FatSecret

export default function FoodSearchScreen() {
  const router = useRouter(); // ✅ hook inside component

  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<Food[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const runSearch = async (pageNumber = 0) => {
    setLoading(true);

    const result = await searchFood(query, pageNumber, PAGE_SIZE);

    setFoods(result.foods);
    setTotal(result.total);
    setPage(pageNumber);

    setLoading(false);
  };

  return (
    <View style={{ padding: 16 }}>
      {/* Search Bar */}
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search food"
          style={{
            flex: 1,
            borderWidth: 1,
            padding: 8,
            marginRight: 8,
          }}
        />
        <TouchableOpacity
          onPress={() => runSearch(0)}
          style={{
            backgroundColor: "#2a7bc9",
            padding: 10,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white" }}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      {total > 0 && (
        <Text style={{ marginBottom: 8 }}>
          {page * PAGE_SIZE + 1}–
          {Math.min((page + 1) * PAGE_SIZE, total)} of {total} for{" "}
          <Text style={{ fontWeight: "bold" }}>{query}</Text>
        </Text>
      )}

      {/* Food List */}
      <FlatList
        data={foods}
        keyExtractor={(item) => item.food_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(tabs)/[id]",
                params: { id: item.food_id },
              })
            }
            style={{ marginBottom: 12 }}
          >
            <Text style={{ fontWeight: "bold", color: "#2a7bc9" }}>
              {item.food_name}
              {item.brand_name && ` (${item.brand_name})`}
            </Text>
            <Text>{item.food_description}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          <TouchableOpacity
            disabled={page === 0}
            onPress={() => runSearch(page - 1)}
          >
            <Text style={{ margin: 4 }}>Previous</Text>
          </TouchableOpacity>

          {[...Array(Math.min(totalPages, 10))].map((_, i) => (
            <TouchableOpacity key={i} onPress={() => runSearch(i)}>
              <Text
                style={{
                  margin: 4,
                  fontWeight: i === page ? "bold" : "normal",
                }}
              >
                {i + 1}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            disabled={page >= totalPages - 1}
            onPress={() => runSearch(page + 1)}
          >
            <Text style={{ margin: 4 }}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
