import React, {useState} from 'react';
import { Box, Grid, Paper, Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function ChatArea({ activeConversation, messages }) {
    const [inputMessage, setInputMessage] = useState('');
    
    // Simple function to handle sending a message (to be replaced with API logic)
    const handleSend = () => {
      if (inputMessage.trim() !== '') {
        console.log("Sending message:", inputMessage);
        setInputMessage('');
        // In a real app, you would dispatch an API call here.
      }
    };
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Chat Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6">{activeConversation.name}</Typography>
        </Box>
  
        {/* Message Display Area */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
          {messages.map((msg) => (
            <Box 
              key={msg.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1.5, 
                  maxWidth: '70%', 
                  bgcolor: msg.sender === 'user' ? '#e1f5fe' : '#f5f5f5', // Light blue for user, grey for others
                  borderRadius: '20px',
                  borderTopRightRadius: msg.sender === 'user' ? 0 : '20px',
                  borderTopLeftRadius: msg.sender === 'user' ? '20px' : 0,
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {msg.time}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
  
        {/* Message Input Footer */}
        <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0' }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                    e.preventDefault(); // Prevents newline in textfield
                  }
                }}
              />
            </Grid>
            <Grid item>
              <IconButton color="primary" onClick={handleSend} disabled={!inputMessage.trim()}>
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }