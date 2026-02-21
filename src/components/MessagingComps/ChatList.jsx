import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, ListItemAvatar, Avatar, Divider, TextField, Badge, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function ChatList({ conversations, activeChatId, onChatSelect, isCollapsed }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    };

    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
        
        {/* Search Bar - Hidden if collapsed */}
        {!isCollapsed && (
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ endAdornment: <SearchIcon color="action" /> }}
                fullWidth
            />
            </Box>
        )}
        
        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
          {filteredConversations.map((chat) => (
            <React.Fragment key={chat.id}>
               <Tooltip title={isCollapsed ? chat.name : ""} placement="right" arrow>
                <ListItemButton 
                    onClick={() => onChatSelect(chat.id)}
                    selected={chat.id === activeChatId}
                    sx={{ 
                        // Center content if collapsed, otherwise left align
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        px: isCollapsed ? 1 : 2,
                        py: 2,
                        '&.Mui-selected': { bgcolor: '#e3f2fd', borderLeft: '4px solid #1976d2' },
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    {/* Collapsed: Remove minWidth to center perfectly. Expanded: Standard 56px */}
                    <ListItemAvatar sx={{ minWidth: isCollapsed ? 0 : 56 }}>
                        <Badge color="error" variant="dot" invisible={chat.unread === 0}>
                            <Avatar sx={{ bgcolor: chat.id === activeChatId ? '#1976d2' : '#bdbdbd' }}>
                                {getInitials(chat.name)}
                            </Avatar>
                        </Badge>
                    </ListItemAvatar>
                    
                    {!isCollapsed && (
                        <>
                            <ListItemText 
                            primary={chat.name} 
                            secondary={
                                <Typography component="span" variant="body2" color="text.secondary" noWrap>
                                    {chat.lastMessage}
                                </Typography>
                            }
                            primaryTypographyProps={{ fontWeight: chat.unread > 0 ? 'bold' : 'medium' }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {chat.time}
                                </Typography>
                            </Box>
                        </>
                    )}
                </ListItemButton>
              </Tooltip>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    );
}