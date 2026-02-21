import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Paper, Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ChatArea({ activeConversation, messages, onSendMessage, onBack }) {
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSend = () => {
      if (inputMessage.trim() !== '') {
        onSendMessage(inputMessage);
        setInputMessage('');
      }
    };
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fff' }}>
        
        {/* Chat Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', bgcolor: '#fafafa' }}>
           {/* Back Button - Visible only on Mobile (xs) */}
           <IconButton 
             edge="start" 
             onClick={onBack} 
             sx={{ mr: 1, display: { xs: 'flex', sm: 'none' } }}
           >
             <ArrowBackIcon />
           </IconButton>

           <Typography variant="h6" noWrap>{activeConversation.name}</Typography>
        </Box>
  
        {/* Message Display Area */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f9f9f9' }}>
          {messages.map((msg) => (
            <Box 
              key={msg.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  maxWidth: '85%', // Slightly wider on mobile for better readability
                  bgcolor: msg.sender === 'user' ? '#1976d2' : '#ffffff', 
                  color: msg.sender === 'user' ? '#fff' : '#000',
                  border: msg.sender !== 'user' && '1px solid #e0e0e0',
                  borderRadius: 2,
                  borderTopRightRadius: msg.sender === 'user' ? 0 : 2,
                  borderTopLeftRadius: msg.sender === 'user' ? 2 : 0,
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, opacity: 0.8 }}>
                  {msg.time}
                </Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
  
        {/* Message Input Footer */}
        <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0', bgcolor: '#fff' }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                    e.preventDefault(); 
                  }
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item>
              <IconButton 
                color="primary" 
                onClick={handleSend} 
                disabled={!inputMessage.trim()}
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
}