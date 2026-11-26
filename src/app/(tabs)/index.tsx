import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchProducts, Product } from '../../services/api';

export default function HomeScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#111" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Could not load products: {error}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
                <Pressable
                    style={styles.card}
                    onPress={() => router.push(`/product/${item.id}`)}
                >
                    <Image
                        source={{ uri: item.images[0]?.src }}
                        style={styles.image}
                        contentFit="cover"
                        transition={200}
                    />
                    <Text style={styles.title} numberOfLines={2}>
                        {item.name}
                    </Text>
                </Pressable>
            )}
        />
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    list: { padding: 12 },
    row: { justifyContent: 'space-between', marginBottom: 12 },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    image: { width: '100%', aspectRatio: 1, backgroundColor: '#f4f4f4' },
    title: { padding: 10, fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
    errorText: { color: '#b91c1c', textAlign: 'center' },
});