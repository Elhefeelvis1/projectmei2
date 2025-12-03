import { useState } from 'react';
import Nav from "../components/GlobalComps/Nav.jsx";
import { Box, Grid, Paper, Typography } from '@mui/material';
import ChatArea from '../components/MessagingComps/ChatArea';
import ChatList from '../components/MessagingComps/ChatList';

export default function Messages() {
    const [activeChat, setActiveChat] = useState(null); // Stores the ID of the selected chat
  
    // Dummy Data for Illustration
    const conversations = [
      { id: 1, name: "Dr. Smith", lastMessage: "See you next week.", time: "10:30 AM", unread: 2 },
      { id: 2, name: "Sarah Connor", lastMessage: "Did you get the file?", time: "Yesterday", unread: 0 },
      { id: 3, name: "System Admin", lastMessage: "Your password expires soon.", time: "Oct 15", unread: 1 },
    ];
  
    // Dummy Messages for the active chat
    const messages = [
      { id: 101, text: "Hello, I have a question about my project.", sender: "user", time: "11:00 AM" },
      { id: 102, text: "Sure, how can I help?", sender: "Dr. Smith", time: "11:05 AM" },
      { id: 103, text: "When is the deadline for the final report?", sender: "user", time: "11:10 AM" },
    ];
  
    return (
      <div>
        <Nav />
        <Box sx={{ flexGrow: 1, height: '90vh', p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Inbox
          </Typography>
          
          {/* Grid container for the two-pane layout */}
          <Grid container component={Paper} sx={{ height: 'calc(100% - 60px)' }}>
            
            {/* Left Pane: Conversation List (30% width) */}
            <Grid item xs={12} sm={4} md={3} sx={{ borderRight: '1px solid #e0e0e0' }}>
              <ChatList 
                conversations={conversations} 
                activeChatId={activeChat} 
                onChatSelect={setActiveChat} 
              />
            </Grid>
    
            {/* Right Pane: Message Area (70% width) */}
            <Grid item xs={12} sm={8} md={9}>
              {activeChat ? (
                <ChatArea activeConversation={conversations.find(c => c.id === activeChat)} messages={messages} />
              ) : (
                <Box pl={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                  <Typography variant="h6" color="text.secondary">
                    Select a conversation to view messages.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  }