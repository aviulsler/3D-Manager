import React, { useEffect, useState } from "react";
import axios from "axios";
import CategorySelect from "./CategorySelect.tsx";
import SubcategorySelect from "./SubcategorySelect.tsx";
import ItemList from "./ItemList.tsx";
import { Box, CircularProgress, Typography, SelectChangeEvent } from "@mui/material";

const DBSearch: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:5000/api/categories")
            .then((response) => {
                setCategories(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setLoading(false);
            });
    }, []);

    const handleCategoryChange = (event: SelectChangeEvent) => {
        const categoryId = event.target.value as string;
        setSelectedCategory(categoryId);
        setSelectedSubcategory(null);

        setLoading(true);
        axios
            .get(`http://localhost:5000/api/subcategories/filter?category_id=${categoryId}`)
            .then((response) => {
                setSubcategories(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching subcategories:", error);
                setLoading(false);
            });
    };

    const handleSubcategoryChange = (event: SelectChangeEvent) => {
        const subcategoryId = event.target.value as string;
        setSelectedSubcategory(subcategoryId);

        setLoading(true);
        axios
            .get(`http://localhost:5000/api/items/filter?subcategory_id=${subcategoryId}`)
            .then((response) => {
                setItems(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setLoading(false);
            });
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                3D-Manager Frontend
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <CategorySelect
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                    {selectedCategory && (
                        <SubcategorySelect
                            subcategories={subcategories}
                            selectedSubcategory={selectedSubcategory}
                            onSubcategoryChange={handleSubcategoryChange}
                        />
                    )}
                    {selectedSubcategory && <ItemList items={items} />}
                </>
            )}
        </Box>
    );
};

export default DBSearch;