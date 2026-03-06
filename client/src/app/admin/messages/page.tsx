'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiCheck, FiTrash2, FiEye } from 'react-icons/fi';
import { formatDate } from '@/utils/helpers';
import type { Contact } from '@/types';

const sampleMessages: Contact[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Project Collaboration',
    message: 'Hi, I would love to collaborate on a web development project. Are you available for freelance work?',
    is_read: false,
    is_archived: false,
    created_at: '2024-03-01T10:30:00Z',
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@company.com',
    subject: 'Job Opportunity',
    message: 'We have an exciting senior developer position that matches your skill set. Would you be interested in discussing this further?',
    is_read: true,
    is_archived: false,
    created_at: '2024-02-28T14:00:00Z',
  },
  {
    id: '3',
    name: 'Alice Williams',
    email: 'alice@startup.io',
    subject: 'Speaking Invitation',
    message: 'We would like to invite you to speak at our upcoming tech conference about modern web development practices.',
    is_read: false,
    is_archived: false,
    created_at: '2024-02-25T09:15:00Z',
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(sampleMessages);
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);

  const markAsRead = (id: string) => {
    setMessages(messages.map((m) => m.id === id ? { ...m, is_read: true } : m));
    toast.success('Marked as read');
  };

  const deleteMessage = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success('Message deleted');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message list */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {messages.filter((m) => !m.is_read).length} unread messages
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <motion.button
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.is_read) markAsRead(message.id);
                }}
                className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                } ${!message.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                whileHover={{ x: 2 }}
              >
                <div className="flex items-center gap-2">
                  {!message.is_read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  <p className={`text-sm font-medium text-gray-900 dark:text-white truncate ${!message.is_read ? 'font-bold' : ''}`}>
                    {message.name}
                  </p>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate mt-1">{message.subject}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(message.created_at)}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          {selectedMessage ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedMessage.subject}</h2>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <FiMail className="w-4 h-4" />
                      {selectedMessage.email}
                    </span>
                    <span>{formatDate(selectedMessage.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!selectedMessage.is_read && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                      aria-label="Mark as read"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    aria-label="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">From: {selectedMessage.name}</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 min-h-[300px]">
              <div className="text-center">
                <FiEye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
