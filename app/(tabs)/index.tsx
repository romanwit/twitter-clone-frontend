import React from "react";
import { SafeAreaView, FlatList, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";

interface Tweet {
  id: string;
  username: string;
  content: string;
}

const mockTweets = [
  {
    id: "1",
    username: "@johndoe",
    content: "My first post!",
  },
  {
    id: "2",
    username: "@alice",
    content: "Hello world! Love React Native ❤️",
  },
];

export default function App() {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    // TODO: replace with fetch from API
    setTweets(mockTweets);
  }, []);

  const renderItem = ({ item }: { item: Tweet }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={tweets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: '#1DA1F2',
          padding: 16,
          borderRadius: 32,
        }}
        onPress={() => {
          // TODO: transition to create post
          alert('create post here (dummy)');
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
