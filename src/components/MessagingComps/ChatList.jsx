import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function ChatList({ conversations, activeChatId, onChatSelect }) {
    return (
      <Box>
        <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search chats..."
            InputProps={{ endAdornment: <SearchIcon color="action" /> }}
            fullWidth
          />
        </Box>
        <List dense sx={{ overflowY: 'auto', maxHeight: 'calc(90vh - 100px)' }}>
          {conversations.map((chat) => (
            <React.Fragment key={chat.id}>
              <ListItem 
                button 
                onClick={() => onChatSelect(chat.id)}
                selected={chat.id === activeChatId}
                sx={{ 
                  bgcolor: chat.unread > 0 ? '#e3f2fd' : 'inherit', // Light blue for unread
                  '&.Mui-selected': { bgcolor: '#bbdefb' }, // Darker blue for active
                }}
              >
                <ListItemAvatar>
                  <Avatar>{chat.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={chat.name} 
                  secondary={chat.lastMessage}
                  primaryTypographyProps={{ fontWeight: chat.unread > 0 ? 'bold' : 'normal' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {chat.time}
                </Typography>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    );
  }