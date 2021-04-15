import React, { memo, useCallback, useRef, useState } from "react";
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
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

export function UserList({
  items,
  onSwipe,
  children: ItemComponent,
  lastEleNodementRef
}) {
  return (
    <List>
      {items.map((item, index) => {
        return (
          <div
            key={item?.id?.toString()}
            ref={items.length === index + 1 ? lastEleNodementRef : undefined}
          >
            <Hammer onSwipe={() => onSwipe(item, index)}>
              <div>
                <ItemComponent item={item} index={index} />
              </div>
            </Hammer>
          </div>
        );
      })}
    </List>
  );
}
export const SwipeableList = memo(UserList);

// Style for the progress icon
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2)
    }
  }
}));

const SIZE = 100;
export function SwipeableListUsageExample() {
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState(() =>
    Array(500)
      .fill(null)
      .map((_, i) => ({
        id: i,
        name: `${randomName.first()} ${randomName.last()}`,
        place: randomName.place()
      }))
  );
  // Displayed Items
  const [displayedItems, setDisplayedItems] = useState(() => {
    return items.slice(0, SIZE);
  });
  // FilteredItems after search
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, updateLoading] = useState(false);
  const observer = useRef(undefined);

  const lastEleNodementRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      // Observing for filterd Data and the last element in the displayed Items
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (filter || displayedItems.length !== items.length) {
            updateLoading(true);
            const listItems = filter ? filteredItems : items;
            setTimeout(() => {
              const displayItems = listItems.slice(
                displayedItems.length,
                displayedItems.length + SIZE
              );
              const data = [...displayedItems, ...displayItems];
              if (filter && displayedItems.length !== data.length) {
                setDisplayedItems(data);
              } else if (!filter) {
                setDisplayedItems(data);
              }
              updateLoading(false);
            }, 3000);
          }
          if (observer.current) {
            observer.current.disconnect();
          }
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [items, displayedItems, filter, filteredItems]
  );

  const debounce = useCallback((fn, limit) => {
    let timer;
    return function (e) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(e);
      }, limit);
    };
  }, []);

  // Debouncing the searched criteria
  const debouncedFilter = useCallback(
    debounce((e) => {
      const filter = e.target.value;
      const filteredData = items.filter((item) => {
        return item.name.toLowerCase().includes(filter.toLowerCase());
      });
      setFilteredItems(filteredData);
      setDisplayedItems(
        !filter ? items.slice(0, SIZE) : filteredData.slice(0, SIZE)
      );
      setFilter(filter);
    }, 500),
    [items]
  );

  const onDelete = useCallback(
    (item) => {
      // Deleting from the (filtered & displayedItems) or displayedItems
      if (filter) {
        setFilteredItems(filteredItems.filter((someItem) => someItem !== item));
        setDisplayedItems(
          displayedItems.filter((someItem) => someItem !== item)
        );
      } else {
        setDisplayedItems(
          displayedItems.filter((someItem) => someItem !== item)
        );
      }
      setItems(items.filter((someItem) => someItem !== item));
    },
    [items, displayedItems, filteredItems, filter]
  );

  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="column" style={{ height: "100vh" }}>
      <TextField
        label="Search Users"
        variant="outlined"
        type="search"
        fullWidth
        // defaultValue={filter}
        onChange={debouncedFilter}
        margin="normal"
      />
      {loading && (
        <div key={"progress"} className={classes.root}>
          <CircularProgress />
        </div>
      )}
      <Box flex={1} overflow="auto">
        <SwipeableList
          items={displayedItems}
          onSwipe={onDelete}
          lastEleNodementRef={lastEleNodementRef}
        >
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
