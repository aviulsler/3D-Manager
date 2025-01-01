import React from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

interface ItemListProps {
    items: { id: string; name: string; description: string; price: number }[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
    return (
        <div>
            <Typography variant="h6" gutterBottom>
    Items:
    </Typography>
    {items.length > 0 ? (
            <List>
                {items.map((item) => (
                        <ListItem key={item.id}>
                        <ListItemText
                            primary={<strong>{item.name}</strong>}
                    secondary={`${item.description} (Price: ${item.price})`}
        />
        </ListItem>
    ))}
        </List>
    ) : (
        <Typography>No items found for the selected subcategory.</Typography>
    )}
        </div>
    );
    };

    export default ItemList;
