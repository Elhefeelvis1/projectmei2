import { useState } from 'react';
import Nav from "../components/GlobalComps/Nav.jsx";
import { Box, Grid, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import ChatArea from '../components/MessagingComps/ChatArea';
import ChatList from '../components/MessagingComps/ChatList';

export default function Messages() {
    const [activeChatId, setActiveChatId] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [conversations, setConversations] = useState([
      { id: 1, name: "Dr. Smith", lastMessage: "See you next week.", time: "10:30 AM", unread: 2 },
      { id: 2, name: "Sarah Connor", lastMessage: "Did you get the file?", time: "Yesterday", unread: 0 },
      { id: 3, name: "System Admin", lastMessage: "Your password expires soon.", time: "Oct 15", unread: 1 },
    ]);
  
    const [messages, setMessages] = useState([
      { id: 101, chatId: 1, text: "Hello, I have a question about my project.", sender: "user", time: "11:00 AM" },
      { id: 102, chatId: 1, text: "Sure, how can I help?", sender: "Dr. Smith", time: "11:05 AM" },
      { id: 103, chatId: 1, text: "When is the deadline for the final report?", sender: "user", time: "11:10 AM" },
      { id: 201, chatId: 2, text: "Hey, did you get the files I sent?", sender: "Sarah Connor", time: "Yesterday" },
      { id: 301, chatId: 3, text: "Security Alert: Please update your password.", sender: "System Admin", time: "Oct 15" },
    ]);

    const activeConversation = conversations.find(c => c.id === activeChatId);
    const activeMessages = messages.filter(m => m.chatId === activeChatId);

    const handleSendMessage = (text) => {
        if (!activeChatId) return;
        const newMessage = {
            id: Date.now(),
            chatId: activeChatId,
            text: text,
            sender: "user",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, newMessage]);
        setConversations((prev) => prev.map(c => 
            c.id === activeChatId 
            ? { ...c, lastMessage: text, time: "Just now", unread: 0 } 
            : c
        ));
    };

    return (
      <div>
        <Nav />
        <Box sx={{ flexGrow: 1, height: '90vh', p: { xs: 0, md: 4 }, pt: { xs: 1, md: 4 } }}>
          <Typography variant="h4" gutterBottom sx={{ display: { xs: 'none', md: 'block' } }}>
            Inbox
          </Typography>
          
          <Grid container component={Paper} sx={{ height: { xs: '90vh', md: 'calc(100% - 20px)' }, borderRadius: { xs: 0, md: 2 }, overflow: 'hidden' }}>
            
            {/* LEFT PANE (Chat List)
                - xs (Mobile): 
                    - If Chat Open: Width 2 (Collapsed)
                    - If No Chat: Width 12 (Full)
                - sm (Desktop): Always Width 4 or 3
            */}
            <Grid item 
                xs={activeChatId ? 2 : 12} 
                sm={4} md={3} 
                sx={{ 
                    borderRight: '1px solid #e0e0e0', 
                    height: '100%',
                    transition: 'all 0.3s ease' // Smooth transition for width change
                }}
            >
              <ChatList 
                conversations={conversations} 
                activeChatId={activeChatId} 
                onChatSelect={setActiveChatId}
                // Collapse only on mobile when a chat is active
                isCollapsed={isMobile && !!activeChatId}
              />
            </Grid>
    
            {/* RIGHT PANE (Chat Area)
                - xs (Mobile):
                    - If Chat Open: Width 10
                    - If No Chat: Width 0 (Hidden) -> This fixes the "Select a conversation" issue
                - sm (Desktop): Always Width 8 or 9
            */}
            <Grid item 
                xs={activeChatId ? 10 : 0} 
                sm={8} md={9} 
                sx={{ 
                    height: '100%', 
                    display: { xs: activeChatId ? 'block' : 'none', sm: 'block' } 
                }}
            >
              {activeConversation ? (
                <ChatArea 
                    activeConversation={activeConversation} 
                    messages={activeMessages} 
                    onSendMessage={handleSendMessage}
                    onBack={() => setActiveChatId(null)} // Allows closing chat on mobile
                />
              ) : (
                /* This is now hidden on mobile because width is 0 when no chat is active */
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: '#f5f5f5' }}>
                  <Typography variant="h6" color="text.secondary">
                    Select a conversation
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </div>
    );
}