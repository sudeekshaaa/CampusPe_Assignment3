$(document).ready(function() {
    // DOM Elements
    const $chatInput = $('#chat-input');
    const $sendBtn = $('#send-btn');
    const $messagesWrapper = $('#messages-wrapper');
    const $welcomeScreen = $('#welcome-screen');
    const $typingIndicator = $('#typing-indicator');
    const $sidebar = $('#sidebar');
    const $sidebarOverlay = $('#sidebar-overlay');
    const $chatContainer = $('#chat-container');
    const $historyList = $('#history-list');

    // State
    let isFirstMessage = true;
    let isGenerating = false;
    let generationTimeout = null;
    let typingInterval = null;

    // Initialize Theme
    const isDarkMode = $('#darkModeToggle').is(':checked');
    if (isDarkMode) {
        $('body').attr('data-theme', 'dark');
    }

    // Model Selection Logic
    $('.model-option').on('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all
        $('.model-option').removeClass('active');
        // Add active class to clicked
        $(this).addClass('active');
        
        // Update header text
        const selectedModel = $(this).data('model');
        $('#current-model-btn').html(`${selectedModel} <span class="ms-2 mt-1 fs-6 text-muted"><i class="fa-solid fa-chevron-down"></i></span>`);
        
        // Update placeholder to indicate the current AI model
        $chatInput.attr('placeholder', `Message ${selectedModel}...`);
        
        // Close sidebar if on mobile since clicking header item acts like a reset
        if ($(window).width() <= 768) {
            $sidebar.removeClass('show');
            $sidebarOverlay.removeClass('show');
        }
    });

    // File Upload / Attachment Logic
    const $attachPreview = $('#attachment-preview');
    const $fileUpload = $('#file-upload');
    
    $('#attach-btn').on('click', function(e) {
        e.preventDefault();
        $fileUpload.click();
    });

    $fileUpload.on('change', function(e) {
        if (this.files && this.files.length > 0) {
            $.each(this.files, function(i, file) {
                const chip = $(`
                    <div class="badge bg-secondary d-flex align-items-center gap-2 p-2 px-3 rounded-pill shadow-sm">
                        <i class="fa-solid fa-file"></i>
                        <span class="text-truncate" style="max-width: 150px;">${file.name}</span>
                        <i class="fa-solid fa-xmark remove-file" style="cursor: pointer;"></i>
                    </div>
                `);
                $attachPreview.append(chip);
            });
            $sendBtn.prop('disabled', false); // Enable send button if we have files
        }
        $(this).val(''); // Clear the value so the exact same file can be selected again
    });

    $attachPreview.on('click', '.remove-file', function() {
        $(this).parent().remove();
        if ($attachPreview.children().length === 0 && $chatInput.val().trim().length === 0) {
            $sendBtn.prop('disabled', true);
        }
        $fileUpload.val('');
    });

    // Auto-resize textarea
    $chatInput.on('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        
        // Enable/disable send button
        const hasText = $(this).val().trim().length > 0;
        const hasFiles = $attachPreview.children().length > 0;
        if (hasText || hasFiles) {
            $sendBtn.prop('disabled', false);
        } else {
            $sendBtn.prop('disabled', true);
        }
    });

    // Handle Enter key (Send), Shift+Enter (Newline)
    $chatInput.on('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isGenerating) {
                sendMessage();
            }
        }
    });

    // Send Button Click
    $sendBtn.on('click', function() {
        if (!isGenerating) {
            sendMessage();
        }
    });

    // Suggestion Card Click
    $('.suggestion-card').on('click', function() {
        const prompt = $(this).data('prompt');
        $chatInput.val(prompt).trigger('input');
        if (!isGenerating) {
            sendMessage();
        }
    });

    // Dark Mode Toggle
    $('#darkModeToggle').on('change', function() {
        if ($(this).is(':checked')) {
            $('body').attr('data-theme', 'dark');
        } else {
            $('body').removeAttr('data-theme');
        }
    });

    // Delete Chat History Item
    $historyList.on('click', '.delete-chat', function(e) {
        e.stopPropagation();
        $(this).closest('.history-item').remove();
    });

    // Sidebar toggles for mobile
    $('#open-sidebar').on('click', function() {
        $sidebar.addClass('show');
        $sidebarOverlay.addClass('show');
    });

    $('#close-sidebar, #sidebar-overlay').on('click', function() {
        $sidebar.removeClass('show');
        $sidebarOverlay.removeClass('show');
    });

    // New Chat Button
    $('#new-chat-btn').on('click', function() {
        if (generationTimeout) clearTimeout(generationTimeout);
        if (typingInterval) clearInterval(typingInterval);
        
        $messagesWrapper.empty();
        $welcomeScreen.show();
        isFirstMessage = true;
        isGenerating = false;
        $chatInput.prop('disabled', false);
        $chatInput.val('').trigger('input');
        $chatInput.focus();
        $sidebar.removeClass('show');
        $sidebarOverlay.removeClass('show');
        $typingIndicator.addClass('d-none');
        $attachPreview.empty();
        $fileUpload.val('');
    });

    // Export Chat functionality
    $('#export-chat-btn').on('click', function() {
        if ($messagesWrapper.children().length === 0) {
            alert('No chat history to export.');
            return;
        }

        let chatText = "Chat History Export\n===================\n\n";
        
        $messagesWrapper.find('.message-container').each(function() {
            const isUser = $(this).find('.user-bubble').length > 0;
            const sender = isUser ? "You" : "AI";
            const text = $(this).find('.message-bubble').text().trim();
            chatText += `${sender}: ${text}\n\n`;
        });

        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat_export_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Main Send Message Logic
    function sendMessage() {
        let text = $chatInput.val().trim();
        const hasAttachment = $attachPreview.children().length > 0;
        if (!text && !hasAttachment) return;
        
        if (hasAttachment) {
             const fileNames = [];
             $attachPreview.find('span.text-truncate').each(function() {
                 fileNames.push($(this).text());
             });
             text = text ? text + "\n\n" : "";
             text += `[Attachments: ${fileNames.join(', ')}]`;
             
             // Clear attachments post send
             $attachPreview.empty();
             $fileUpload.val('');
        }

        // Hide welcome screen on first message
        if (isFirstMessage) {
            $welcomeScreen.hide();
            isFirstMessage = false;
            
            // Add to chat history
            const truncateText = text.length > 25 ? text.substring(0, 25) + '...' : text;
            $historyList.prepend(`
                <li class="history-item border-0 d-flex justify-content-between align-items-center">
                    <div class="text-truncate flex-grow-1">
                        <i class="fa-regular fa-message me-3 text-secondary"></i> ${escapeHTML(truncateText)}
                    </div>
                    <button class="btn btn-link p-0 text-secondary delete-chat" title="Delete chat"><i class="fa-solid fa-trash-can" style="font-size: 0.8rem;"></i></button>
                </li>
            `);
        }

        // Add User Message
        addMessage(text, 'user');

        // Reset Input
        $chatInput.val('').trigger('input');
        
        // Start AI Response Mock
        isGenerating = true;
        $chatInput.prop('disabled', true);
        $sendBtn.prop('disabled', true);
        $typingIndicator.removeClass('d-none');
        scrollToBottom();

        // Simulate network delay (1-1.5 seconds)
        const delay = Math.floor(Math.random() * 500) + 1000;
        
        generationTimeout = setTimeout(() => {
            $typingIndicator.addClass('d-none');
            const aiResponse = generateAIResponse(text);
            
            // Claude-like smooth token streaming animation
            addMessageAnimated(aiResponse, 'ai');
            
        }, delay);
    }

    // Add User Message to DOM
    function addMessage(text, sender) {
        // Since we refactored, user message is right aligned in a gray bubble
        const messageHTML = `
            <div class="message-container user-message-wrapper">
                <div class="message-bubble user-bubble fs-6 fw-normal">
                    ${escapeHTML(text).replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
        
        $messagesWrapper.append(messageHTML);
        scrollToBottom();
    }

    // Animated Typing for AI Messages (Claude-style word streaming)
    function addMessageAnimated(text, sender) {
        const avatarClass = 'ai-avatar';
        const avatarIcon = '<i class="fa-solid fa-bolt text-white"></i>';
        const bubbleClass = 'ai-bubble';
        
        const messageId = 'msg-' + new Date().getTime();
        
        // AI message is just plain text aligned left with Avatar
        const messageHTML = `
            <div class="message-container d-flex align-items-start">
                <div class="avatar ${avatarClass} rounded-circle me-3 d-flex justify-content-center align-items-center">
                    ${avatarIcon}
                </div>
                <div class="message-bubble ${bubbleClass} flex-grow-1 fs-6 fw-normal">
                    <div id="${messageId}"></div>
                </div>
            </div>
        `;
        
        $messagesWrapper.append(messageHTML);
        scrollToBottom();
        
        const $msgElement = $(`#${messageId}`);
        // Split by words and spaces to simulate streaming chunks
        const tokens = text.split(/(\\s+|\\n)/);
        let index = 0;
        
        // Typing speed: ~20ms per token
        typingInterval = setInterval(() => {
            if (index < tokens.length) {
                let token = tokens[index];
                if (token === '\\n' || token === '\\n\\n') {
                    $msgElement.append('<br>');
                } else if (token) {
                    $msgElement.append(`<span class="char-stream">${escapeHTML(token).replace(/\\n/g, '<br>')}</span>`);
                }
                index++;
                if (index % 5 === 0) scrollToBottom();
            } else {
                clearInterval(typingInterval);
                isGenerating = false;
                $chatInput.prop('disabled', false);
                $chatInput.focus();
                scrollToBottom();
            }
        }, 20);
    }

    // Scroll to bottom of chat area smoothly
    function scrollToBottom() {
        $chatContainer[0].scrollTo({
            top: $chatContainer[0].scrollHeight,
            behavior: 'smooth'
        });
    }

    // Simple HTML Escaping
    function escapeHTML(str) {
        return $('<div>').text(str).html();
    }

    // Mock AI Responses based on input keywords
    function generateAIResponse(userInput) {
        const input = userInput.toLowerCase();
        
        if (input.includes('hello') || input.includes('hi')) {
            return "Hello there! How can I help you today?";
        } else if (input.includes('quantum computing')) {
            return "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers.\\n\\nUnlike regular computers that use bits (0s and 1s), quantum computers use quantum bits or 'qubits' which can exist in multiple states simultaneously due to superposition.";
        } else if (input.includes('python')) {
            return "Here is a simple idea for web scraping in Python using BeautifulSoup:\\n\\n1. Install requests and beautifulsoup4\\n2. Use requests.get(url) to fetch the page\\n3. Use BeautifulSoup(html, 'html.parser') to parse\\n4. Use soup.find() or soup.find_all() to extract data.\\n\\nWould you like me to write the actual code for this?";
        } else if (input.includes('dinner')) {
            return "Here are a few quick and delicious dinner ideas:\\n\\n1. Garlic Butter Chicken with Roasted Asparagus\\n2. Lemon Garlic Shrimp Pasta\\n3. Vegetarian Chickpea Curry with Rice\\n4. Sheet Pan Fajitas\\n\\nWhich one sounds best to you?";
        } else if (input.includes('email') || input.includes('boss')) {
            return "Subject: Request for Brief Meeting to Discuss Project Updates\\n\\nHi [Boss's Name],\\n\\nI hope this email finds you well.\\n\\nI would like to schedule a brief 15-minute meeting this week to provide an update on our current project and get your feedback on a few key decisions.\\n\\nPlease let me know what day and time works best for you.\\n\\nBest regards,\\n[Your Name]";
        } else {
            const responses = [
                "That's an interesting perspective. Could you tell me more about it?",
                "I understand. Here's what I think: based on current best practices, we should focus on building robust, scalable solutions.",
                "I'm an AI assistant created for this assignment. While I can't look up real-time information, I can simulate a helpful response based on your input!",
                "That sounds like a great idea. Implementing it step-by-step would be the best approach.",
                "Thank you for sharing that. Is there anything specific you would like me to help you with regarding this topic?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
});
