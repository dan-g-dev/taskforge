import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';

interface AskZiaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'zia';
  text: string;
}

export const AskZiaDrawer: React.FC<AskZiaDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'zia',
      text: "Hello! I'm Zia, your AI assistant for TaskForge. Ask me anything about Gantt charts, timesheets, automations, or how to import your data."
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'How do I set task dependencies in Gantt?',
    'How do timesheets sync with TaskForge Invoice?',
    'Can I migrate existing Jira or Trello boards?',
    'What are Project Blueprints?'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMsgs: Message[] = [...messages, { sender: 'user', text }];
    setMessages(newMsgs);
    setInputQuery('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = "TaskForge enables end-to-end planning with integrated Gantt timelines, timesheet timers, and custom fields. You can also customize automated Blueprints for repeatable processes.";
      
      const lower = text.toLowerCase();
      if (lower.includes('gantt') || lower.includes('dependenc')) {
        reply = "In TaskForge, you can set Finish-to-Start, Start-to-Start, or Finish-to-Finish dependencies by dragging the anchor handle on any Gantt chart bar to the target task. Critical paths are highlighted automatically.";
      } else if (lower.includes('invoice') || lower.includes('timesheet')) {
        reply = "Logged hours in the Timesheets module (both manual entries and stopwatch timer records) sync directly into TaskForge Invoice. You can generate customer-ready invoices with 1-click approvals.";
      } else if (lower.includes('jira') || lower.includes('migrat') || lower.includes('trello')) {
        reply = "Yes! You can import your Jira, Trello, Asana, or Basecamp projects via JSON/CSV export files. Task IDs, subtasks, attachments, and user assignments are mapped cleanly.";
      } else if (lower.includes('blueprint')) {
        reply = "Blueprints in TaskForge let you configure strictly enforced step-by-step processes. For example, a task cannot move to 'Closed' until a QA sign-off field is completed.";
      }

      setMessages([...newMsgs, { sender: 'zia', text: reply }]);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10">
          
          {/* Drawer Header */}
          <div className="bg-[#0b1329] text-white px-5 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-cyan-400 p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-[#0b1329] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  <span>Ask Zia</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/30">AI Assistant</span>
                </div>
                <div className="text-[11px] text-slate-400">TaskForge Intelligence</div>
              </div>
            </div>

            <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'zia' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0066D6] text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick Prompts Suggestions */}
            {messages.length <= 2 && (
              <div className="pt-2 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Questions</div>
                {quickPrompts.map((qp) => (
                  <button
                    key={qp}
                    onClick={() => handleSend(qp)}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-blue-50/50 hover:border-blue-200 text-slate-700 hover:text-blue-700 text-xs transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{qp}</span>
                    <ArrowRight className="w-3 h-3 shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Zia about TaskForge..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2 rounded-lg bg-[#0066D6] hover:bg-blue-700 text-white disabled:opacity-40 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
