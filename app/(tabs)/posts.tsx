import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export default function MyPostsScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type MyPayload = {
    id: number;
    username: string;
    iat: number;
    exp: number;
  };

  async function getUserIdFromToken(): Promise<number | null> {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) return null;

    try {
      const decoded = jwtDecode<MyPayload>(token);
      return decoded.id;
    } catch (err) {
      console.error('Failed to decode token', err);
      return null;
    }
  }

  useEffect(() => {
    async function fetchPosts() {
      try {
        const userId = await getUserIdFromToken();
        if (!userId) {
          setError('User ID not found');
          setLoading(false);
          return;
        }

        console.log(userId);

        const response = await fetch(`http://localhost:3000/posts/author/${userId}`);
        if (!response.ok) {
          throw new Error(`Server responded ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading your posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No posts yet. Try creating one!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.postContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
          <Text style={styles.author}>by {item.author.username}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  postContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: 'gray',
  },
});

