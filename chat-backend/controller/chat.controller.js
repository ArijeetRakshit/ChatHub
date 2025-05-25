import Conversation from "../models/chat.model.js";

export const addMsgToConversation = async (participants, msg) => {
   try {
      let conversation = await Conversation.findOne({ users: { $all: participants } });
      if (!conversation) 
         conversation = await Conversation.create({ users: participants });
      
      conversation.msgs.push(msg);
      await conversation.save();
        
   }  catch (error) {
       console.log('Error adding message to conversation: ', error.message);
   }
};

export const getMsgsForConversation = async (req, res) => {
   try {
      const { user1, user2 } = req.query;
      const participants = [user1, user2];

      const conversation = await Conversation.findOne({ users: { $all: participants } });

      if (!conversation) {
         console.log('Conversation not found');
         return res.status(200).send();
      }

      return res.json(conversation.msgs);
   }  catch (error) {
      console.log('Error fetching messages:', error);
      res.status(500).json({ error: 'Server error' });
   }
};

