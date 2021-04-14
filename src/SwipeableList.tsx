import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/Delete";
import Hammer from "react-hammerjs";
import randomName from "random-name";

export function SwipeableList({ items, onSwipe, children: ItemComponent }) {
  return (
    <List>
      {items.map((item, index) => (
        <Hammer onSwipe={() => onSwipe(item, index)}>
          <div>
            <ItemComponent item={item} index={index} />
          </div>
        </Hammer>
      ))}
    </List>
  );
}

export function SwipeableListUsageExample() {
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState(() =>
    Array(100)
      .fill(null)
      .map((_, i) => ({
        id: i,
        name: `${randomName.first()} ${randomName.last()}`,
        place: randomName.place()
      }))
  );

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );
  const onDelete = (item) =>
    setItems(items.filter((someItem) => someItem !== item));

  return (
    <Box display="flex" flexDirection="column" style={{ height: "100vh" }}>
      <TextField
        label="Search Users"
        variant="outlined"
        type="search"
        fullWidth
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        margin="normal"
      />
      <Box flex={1} overflow="auto">
        <SwipeableList items={filteredItems} onSwipe={onDelete}>
          {({ item, index }) => (
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={item.place} />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => onDelete(item)}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </SwipeableList>
      </Box>
    </Box>
  );
}
