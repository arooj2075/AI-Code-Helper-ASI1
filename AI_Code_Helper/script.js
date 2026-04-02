const startBtn = document.getElementById('startBtn');
const splash = document.getElementById('splash');
const mainApp = document.getElementById('mainApp');

startBtn.addEventListener('click', () => {
    splash.classList.add('fade-out');
    setTimeout(() => { splash.style.display="none"; mainApp.classList.remove('hidden'); },800);
});


const submitBtn = document.getElementById('submitBtn');
const improveBtn = document.getElementById('improveBtn');
const explainBtn = document.getElementById('explainBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearChatBtn = document.getElementById('clearChatBtn');

const userInput = document.getElementById('userInput');
const aiOutput = document.getElementById('aiOutput').querySelector('code');
const loadingDots = document.getElementById('loadingDots');
const chatContainer = document.getElementById('chatContainer');

const API_KEY = "YOUR_API_KEY_HERE";
const API_URL = "https://api.asi1.ai/v1/chat/completions";

async function callASI(prompt) {
    try {
        loadingDots.style.display="block";
        const response = await fetch(API_URL, {
            method:"POST",
            headers: { "Content-Type":"application/json", "Authorization":`Bearer ${API_KEY}` },
            body: JSON.stringify({ model:"asi1", messages:[{role:"user",content:prompt}] })
        });
        if(!response.ok) throw new Error("API request failed");
        const data = await response.json();
        return data.choices[0].message.content;
    } catch(e){ return "❌ Error: "+e.message; }
    finally { loadingDots.style.display="none"; }
}


async function typeOutput(text){
    aiOutput.textContent="";
    for(let i=0;i<text.length;i++){
        aiOutput.textContent+=text[i];
        await new Promise(r=>setTimeout(r,8));
    }
    Prism.highlightElement(aiOutput);
}


function addChatBubble(prompt,response){
    const userDiv=document.createElement('div');
    userDiv.classList.add('chat-bubble','user-bubble'); userDiv.textContent=prompt;
    chatContainer.appendChild(userDiv);

    const aiDiv=document.createElement('div');
    aiDiv.classList.add('chat-bubble','ai-bubble'); aiDiv.textContent=response;
    chatContainer.appendChild(aiDiv);

    chatContainer.scrollTop=chatContainer.scrollHeight;
}

clearChatBtn.addEventListener('click',()=>{ chatContainer.innerHTML=""; });

async function handleAction(promptText){
    await typeOutput("⏳ Processing...\n");
    const result = await callASI(promptText);
    await typeOutput(result);
    addChatBubble(promptText,result);
}

submitBtn.addEventListener('click',()=>{ 
    if(!userInput.value.trim()) return alert("Enter a problem first!");
    handleAction(`Generate code for:\n${userInput.value}`);
});

improveBtn.addEventListener('click',()=>{ 
    const code=aiOutput.textContent; if(!code) return alert("Generate code first!");
    handleAction(`Improve this code:\n${code}`);
});

explainBtn.addEventListener('click',()=>{ 
    const code=aiOutput.textContent; if(!code) return alert("Generate code first!");
    handleAction(`Explain this code:\n${code}`);
});

copyBtn.addEventListener('click',async()=>{ await navigator.clipboard.writeText(aiOutput.textContent); alert("Copied!"); });

downloadBtn.addEventListener('click',()=>{ 
    const blob=new Blob([aiOutput.textContent],{type:"text/plain"});
    const link=document.createElement("a"); link.href=URL.createObjectURL(blob); link.download="code.txt"; link.click();
});