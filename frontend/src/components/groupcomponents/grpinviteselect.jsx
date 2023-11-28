import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { useContacts } from '../../context/contactscontext';
import { green } from '@mui/material/colors';
import UsersProfilePicture from '../UsersProfilePicture';
export default function GrpInviteSelect({checked,setChecked}) {
 
  const {contacts}=useContacts();
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const arr=contacts.filter((contact)=>{
    return contact.isgroup===false;
  })
  let idx=0;
  return (
    <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {arr.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem
            key={idx++}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            
            <ListItemButton>
              <ListItemAvatar>
              <div>
                   <UsersProfilePicture style={1} item={value}></UsersProfilePicture>
              </div>
              </ListItemAvatar>
              <ListItemText id={labelId} primary={value.username} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}